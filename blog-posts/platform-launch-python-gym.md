---
title: "Introducing Codeset Platform and Codeset-Gym"
date: "2025-10-13"
excerpt: "Our platform for training and evaluating agentic code models is now live, featuring the first batch of codeset-gym-python containing 1,000 novel SWE tasks from 274 real-world Python repositories."
---

We're excited to announce that the Codeset platform is now publicly available, along with our first dataset: **codeset-gym-python**.

## What We're Launching

**Codeset Platform** provides API access to sandboxed, reproducible environments for training and evaluating code agents. Each environment comes pre-configured with dependencies, test suites, and verification scripts—accessible through a simple Python SDK.

**codeset-gym-python** is our first training dataset: 1,000 real-world bug-fixing tasks spanning 274 Python repositories, complete with issue descriptions, commit history, and comprehensive test suites. These samples are drawn from permissively licensed repositories and include novel tasks not found in existing public datasets. We'll be releasing additional samples in the coming weeks.

## Why This Matters

Training code agents on real-world tasks has traditionally been slow and brittle. Reproducing environments, managing dependencies, and running verifications across thousands of samples creates significant overhead. We've built infrastructure to solve this.

Our platform spins up isolated containers for each task, handles all dependency management, and provides fast verification through test-suite execution. What previously required managing complex build systems and test runners now reduces to API calls.

## What's Next

We're actively expanding our dataset coverage to additional programming languages (Java, JavaScript, Rust, Go, C++, C#) and task types beyond bug-fixing. Our infrastructure is built on GitBug-Actions, a system for mining and reproducing GitHub repository states with their CI environments intact.

We're also building custom datasets on commission for training runs with specific requirements. If you need tailored data for your code models, reach out.

## Try It Now

Sign up at [codeset.ai](https://codeset.ai) to get $5 in free credits. The platform is pay-as-you-go with no minimum commitment.

Install the SDK:
```bash
pip install codeset
```

Get started with a simple example:
```python
from codeset import Codeset

# Initialize client
client = Codeset(api_key="your_api_key")

# Create a session for a Python task
session = client.sessions.create(
    dataset="codeset-gym-python",
    sample_id="psf__requests-6091"
)

# Execute commands in the sandboxed environment
response = client.sessions.execute_command(
    session_id=session.session_id,
    command="pytest tests/test_requests.py"
)

# Run verification
result = client.sessions.verify.start(session_id=session.session_id)
```

Read our [documentation](https://docs.codeset.ai) to learn more about the SDK, session lifecycle, and verification system.

We're building this for research teams and practitioners working on the next generation of code agents. If that's you, we'd love to hear your feedback.
