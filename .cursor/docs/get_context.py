#!/usr/bin/env python3
"""
Retrieve detailed information for a specific file path.

Usage:
    python .cursor/docs/retrieve_file_info.py <file_path>

The script reads from .cursor/docs/files.json and returns all information
relevant to the provided file path including:
- Detailed description of the file
- Semantic tags, entities handled, and key behaviors
- Part of (feature/flow context with upstream/downstream)
- Related files with semantic explanations
- Tests that exercise this file
- Change impact hints (signature, behavior, field changes)
- Historical insights (bugs, fixes, lessons learned)
"""

import json
import random
import sys
from pathlib import Path


def normalize_path(path):
    """Normalize a file path for comparison."""
    return str(Path(path).as_posix())


def load_files_data(docs_dir):
    """Load files data from JSON file."""
    files_json = docs_dir / "files.json"
    if not files_json.exists():
        return {}

    try:
        with open(str(files_json), "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        print("Error loading files.json: {}".format(e), file=sys.stderr)
        return {}


def _truncate(text, max_len):
    """Truncate text to max_len, adding ellipsis if needed."""
    if len(text) <= max_len:
        return text
    return text[:max_len - 3] + "..."


def _sample(items, max_items):
    """Return items as-is if within cap, otherwise randomly sample."""
    if len(items) <= max_items:
        return items
    return random.sample(items, max_items)


def _render_description(file_data):
    description = file_data.get("description", "")
    if not description:
        return ""
    return "### Description\n{}".format(_truncate(description, 1500))


def _render_edit_checklist(file_data):
    checklist = file_data.get("edit_checklist", {})
    if not checklist:
        return ""
    lines = ["### Edit Checklist"]
    tests_to_run = checklist.get("tests_to_run", [])
    if tests_to_run:
        lines.append("Tests to run: {}".format(
            ", ".join("`{}`".format(c) for c in tests_to_run)))
    data_constants = checklist.get("data_constants_to_check", [])
    if data_constants:
        lines.append("Data/constants: {}".format(
            ", ".join("`{}`".format(c) for c in data_constants)))
    if checklist.get("owns_authoritative_data"):
        lines.append("WARNING: Owns authoritative data - single source of truth.")
    if checklist.get("public_api_surface"):
        lines.append("WARNING: Public API surface - changes may affect consumers.")
    return "\n".join(lines)


def _render_insights(file_data):
    insights = file_data.get("insights", [])
    if not insights:
        return ""
    sampled = _sample(insights, 5)
    lines = ["### Historical Insights"]
    for insight in sampled:
        category = insight.get("category", "")
        title = insight.get("title", "")
        if category and title:
            lines.append("- [{}] {}".format(category, title))
        elif title:
            lines.append("- {}".format(title))
        if insight.get("problem"):
            lines.append("  Problem: {}".format(
                _truncate(insight["problem"], 400)))
        if insight.get("root_cause"):
            lines.append("  Root cause: {}".format(
                _truncate(insight["root_cause"], 400)))
        if insight.get("solution"):
            lines.append("  Solution: {}".format(
                _truncate(insight["solution"], 400)))
        commits = insight.get("commits", [])
        if commits:
            lines.append("  Commits: {}".format(
                ", ".join("`{}`".format(c) for c in commits)))
        constructs = insight.get("constructs", [])
        if constructs:
            lines.append("  Constructs: {}".format(
                ", ".join("`{}`".format(c) for c in constructs)))
    if len(insights) > 5:
        lines.append("(+{} more insights)".format(len(insights) - 5))
    return "\n".join(lines)


def _render_key_constructs(file_data):
    key_constructs = file_data.get("key_constructs", [])
    if not key_constructs:
        return ""
    capped = key_constructs[:8]
    lines = ["### Key Constructs"]
    for c in capped:
        name = c.get("name", "")
        ctype = c.get("type", "")
        purpose = c.get("purpose", "")
        lines.append("- **{}** ({}): {}".format(
            name, ctype, _truncate(purpose, 400)))
        reasoning = c.get("reasoning", "")
        if reasoning:
            lines.append("  {}".format(_truncate(reasoning, 300)))
        callers = c.get("callers", [])
        if callers:
            for caller in callers[:3]:
                lines.append("  - `{}:{}` `{}`".format(
                    caller.get("file", ""),
                    caller.get("line", ""),
                    _truncate(caller.get("context", ""), 100)))
            if len(callers) > 3:
                lines.append("  - +{} more callers".format(
                    len(callers) - 3))
    if len(key_constructs) > 8:
        lines.append("(+{} more constructs)".format(
            len(key_constructs) - 8))
    return "\n".join(lines)


def _render_tests(file_data):
    tests = file_data.get("tests", {})
    if not tests:
        return ""
    lines = ["### Tests"]
    exercised_by = tests.get("exercised_by", [])
    if exercised_by:
        lines.append("Files: {}".format(
            ", ".join("`{}`".format(f) for f in exercised_by)))
    test_functions = tests.get("test_functions", [])
    if test_functions:
        sampled = _sample(test_functions, 5)
        lines.append("Functions: {}".format(
            ", ".join("`{}`".format(f) for f in sampled)))
        if len(test_functions) > 5:
            lines.append("(+{} more functions)".format(
                len(test_functions) - 5))
    example_cmd = tests.get("example_command", "")
    if example_cmd:
        lines.append("Run: `{}`".format(example_cmd))
    relevant_snippets = tests.get("relevant_snippets", [])
    if relevant_snippets:
        for s in relevant_snippets[:3]:
            lines.append("- `{}` L{}: {}".format(
                s.get("file", ""),
                s.get("lines", ""),
                _truncate(s.get("description", ""), 250)))
    return "\n".join(lines)


def _render_related_files(file_data):
    related_files = file_data.get("related_files", [])
    if not related_files:
        return ""
    co_change = [rf for rf in related_files if rf.get("likely_co_change")]
    non_co_change = [rf for rf in related_files
                     if not rf.get("likely_co_change")]
    if len(co_change) >= 5:
        selected = _sample(co_change, 5)
    else:
        remaining = 5 - len(co_change)
        selected = co_change + _sample(
            non_co_change, min(remaining, len(non_co_change)))
    lines = ["### Related Files"]
    for rf in selected:
        path = rf.get("path", "")
        rel = rf.get("relationship", "")
        reason = rf.get("reason_to_check", "")
        co = " [co-change]" if rf.get("likely_co_change") else ""
        entry = "`{}`{}".format(path, co)
        if rel:
            entry += " | Rel: {}".format(_truncate(rel, 250))
        if reason:
            entry += " | Check: {}".format(_truncate(reason, 250))
        lines.append("- {}".format(entry))
    if len(related_files) > 5:
        lines.append("(+{} more)".format(len(related_files) - 5))
    return "\n".join(lines)


def _render_semantic_overview(file_data):
    semantic_tags = file_data.get("semantic_tags", [])
    handles_entities = file_data.get("handles_entities", [])
    key_behaviors = file_data.get("key_behaviors", [])
    if not (semantic_tags or handles_entities or key_behaviors):
        return ""
    lines = ["### Semantic Overview"]
    if semantic_tags:
        lines.append("Tags: {}".format(
            ", ".join("`{}`".format(t) for t in semantic_tags)))
    if handles_entities:
        lines.append("Entities: {}".format(
            ", ".join("`{}`".format(e) for e in handles_entities)))
    if key_behaviors:
        sampled = _sample(key_behaviors, 5)
        for b in sampled:
            lines.append("- {}".format(_truncate(b, 300)))
        if len(key_behaviors) > 5:
            lines.append("(+{} more behaviors)".format(
                len(key_behaviors) - 5))
    return "\n".join(lines)


def _render_pitfalls(file_data):
    pitfalls = file_data.get("pitfalls", [])
    if not pitfalls:
        return ""
    lines = ["### Pitfalls"]
    for p in pitfalls:
        mistake = p.get("mistake", "")
        consequence = p.get("consequence", "")
        prevention = p.get("prevention", "")
        lines.append("- {}".format(mistake))
        if consequence:
            lines.append("  Consequence: {}".format(
                _truncate(consequence, 300)))
        if prevention:
            lines.append("  Prevention: {}".format(
                _truncate(prevention, 300)))
    return "\n".join(lines)


def _render_derived_requirements(file_data):
    derived = file_data.get("derived_requirements", [])
    if not derived:
        return ""
    sampled = _sample(derived, 5)
    lines = ["### Derived Requirements"]
    lines.append("(from tests; may change based on user intent)")
    for req in sampled:
        requirement = req.get("requirement", "")
        req_type = req.get("type", "")
        badge = "[{}] ".format(req_type.upper()) if req_type else ""
        lines.append("- {}{}".format(badge, _truncate(requirement, 400)))
    if len(derived) > 5:
        lines.append("(+{} more)".format(len(derived) - 5))
    return "\n".join(lines)


def _render_reading_guide(file_data):
    guide = file_data.get("reading_guide", {})
    if not guide:
        return ""
    lines = ["### Reading Guide"]
    start_here = guide.get("start_here", "")
    if start_here:
        lines.append("Start: `{}`".format(start_here))
    key_sections = guide.get("key_sections", [])
    if key_sections:
        lines.append("Key: {}".format(", ".join(key_sections)))
    skip_sections = guide.get("skip_unless_needed", [])
    if skip_sections:
        lines.append("Skip: {}".format(", ".join(skip_sections)))
    return "\n".join(lines)


_SECTIONS = [
    (1, _render_description),
    (1, _render_edit_checklist),
    (1, _render_insights),
    (2, _render_key_constructs),
    (2, _render_tests),
    (3, _render_related_files),
    (3, _render_semantic_overview),
    (3, _render_pitfalls),
    (4, _render_derived_requirements),
    (4, _render_reading_guide),
]


def format_file_info(file_path, file_data, max_chars=20000):
    """Format file information as compact, budget-aware markdown."""
    header = "# {}\n".format(file_path)
    remaining = max_chars - len(header)
    parts = [header]

    for priority in (1, 2, 3, 4):
        tier_fns = [fn for p, fn in _SECTIONS if p == priority]
        for render_fn in tier_fns:
            section = render_fn(file_data)
            if not section:
                continue
            section_text = "\n" + section
            if len(section_text) <= remaining:
                parts.append(section_text)
                remaining -= len(section_text)
            else:
                if remaining > 20:
                    truncated = section_text[:remaining - 15]
                    truncated += "\n[...truncated]"
                    parts.append(truncated)
                remaining = 0
                break
        if remaining <= 0:
            break

    return "".join(parts)


def retrieve_file_info(file_path, docs_dir):
    """Retrieve and format information for a file path."""
    project_root = docs_dir.parent.parent.resolve()

    # Convert absolute path to relative path if it's within the project root
    file_path_obj = Path(file_path).absolute()
    if project_root in file_path_obj.parents:
        file_path = str(file_path_obj.relative_to(project_root))

    files_data = load_files_data(docs_dir)
    if not files_data:
        return False, "# File Information: {}\n\nNo files.json data available.".format(
            file_path
        )

    files = files_data.get("files", {})
    file_path_norm = normalize_path(file_path)

    file_info = files.get(file_path_norm) or files.get(file_path)

    if not file_info:
        for key in files:
            if normalize_path(key) == file_path_norm:
                file_info = files[key]
                break

    if not file_info:
        return (
            False,
            "# File Information: {}\n\nNo information found for this file in files.json.".format(
                file_path
            ),
        )

    return True, format_file_info(file_path, file_info)


def main():
    """Main entry point.

    Supports two modes:
    1. Hook mode: Reads JSON from stdin (PostToolUse hook format)
    2. Standalone mode: Takes file path as command-line argument
    """
    # If command-line arguments provided, use standalone mode
    if len(sys.argv) >= 2:
        file_path = sys.argv[1]
        script_path = Path(__file__).resolve()
        docs_dir = script_path.parent

        success, output = retrieve_file_info(file_path, docs_dir)
        if not success:
            print(output)
            sys.exit(1)
        print(output)
        return

    # Otherwise, try hook mode: read JSON from stdin
    try:
        input_data = json.load(sys.stdin)

        # Check if this looks like hook input (has hook_event_name or tool_response)
        if "hook_event_name" in input_data or "tool_response" in input_data:
            # Extract file path from tool response (PostToolUse has tool_response)
            tool_response = input_data.get("tool_response", {})
            file_path = tool_response.get("filePath") or tool_response.get("file_path")

            # Fallback to tool_input if not in response
            if not file_path:
                tool_input = input_data.get("tool_input", {})
                file_path = tool_input.get("target_file") or tool_input.get("file_path")

            if file_path:
                script_path = Path(__file__).resolve()
                docs_dir = script_path.parent

                success, file_info = retrieve_file_info(file_path, docs_dir)

                if not success:
                    output = {
                        "decision": "block",
                        "reason": "No information found for this file in files.json. Proceed as normal.",
                    }

                # Output JSON with additional context for Claude
                output = {
                    "decision": "block",
                    "reason": "Relevant information about the file you are reading was found. Appending it to the conversation.",
                    "hookSpecificOutput": {
                        "hookEventName": "PostToolUse",
                        "additionalContext": file_info,
                    },
                }

                print(json.dumps(output))
                sys.exit(0)
    except (json.JSONDecodeError, ValueError, OSError):
        # Not valid JSON or not hook input
        pass

    # If we get here, neither mode worked
    print("Usage: python retrieve_file_info.py <file_path>", file=sys.stderr)
    sys.exit(2)


if __name__ == "__main__":
    main()
