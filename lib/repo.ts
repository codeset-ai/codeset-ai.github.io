const OWNER_REPO_REGEX = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;

function normalizeRepo(input: string): string {
  let s = input.trim();
  if (!s) return '';
  s = s.replace(/#.*$/, '').replace(/\?.*$/, '');
  s = s.replace(/\.git$/i, '');
  s = s.replace(/\/+$/, '');
  if (/^git@github\.com:/i.test(s)) {
    s = s.replace(/^git@github\.com:/i, '');
    return s;
  }
  if (/^https?:\/\/(www\.)?github\.com\//i.test(s)) {
    s = s.replace(/^https?:\/\/(www\.)?github\.com\//i, '');
    return s;
  }
  if (/^github\.com\//i.test(s)) {
    s = s.replace(/^github\.com\/?/i, '');
    return s;
  }
  return s;
}

export function isValidRepoFormat(ownerRepo: string): boolean {
  if (!ownerRepo) return false;
  if (ownerRepo.length > 200) return false;
  return OWNER_REPO_REGEX.test(ownerRepo);
}

export function parseRepo(input: string): { ok: true; repo: string } | { ok: false; error: string } {
  const normalized = normalizeRepo(input);
  if (!normalized) {
    return { ok: false, error: 'Enter a repository (e.g. owner/repo or a GitHub URL).' };
  }
  if (!isValidRepoFormat(normalized)) {
    return { ok: false, error: 'Use format owner/repo or a GitHub repository URL.' };
  }
  return { ok: true, repo: normalized };
}

export { normalizeRepo };
