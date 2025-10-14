---
title: "Introducing Codeset Platform and Codeset-Gym"
date: "2025-10-14"
excerpt: "Our platform for training and evaluating agentic code models is now live, featuring the first batch of codeset-gym-python containing 1,000 novel SWE tasks from 274 real-world Python repositories."
---

We're excited to announce that the Codeset platform is now publicly available, along with our first dataset: **codeset-gym-python**.

## What We're Launching

**Codeset Platform** provides API access to sandboxed, reproducible environments for training and evaluating code agents. Each environment comes pre-configured with dependencies, test suites, and verification scripts—accessible through a simple Python SDK.

**codeset-gym-python** is our first training dataset: 1,000 real-world bug-fixing tasks spanning 274 Python repositories, complete with issue descriptions, commit history, and comprehensive test suites. These samples are drawn from permissively licensed repositories and include **novel samples** not found in any existing public datasets¹. We'll be releasing additional samples in the coming weeks. **codeset-gym-python** is available on [HF](XXX) and on the **Codeset Platform** from day one!

## Why This Matters

Training code agents on real-world tasks has traditionally been slow and brittle. Reproducing environments, managing dependencies, and running verifications across thousands of samples creates significant overhead. We've built infrastructure to solve this.

Our platform spins up isolated containers for each task, handles all dependency management, and provides fast verification through test-suite execution. What previously required managing complex build systems and test runners now reduces to API calls.

## What's Next

We're actively expanding our dataset coverage to additional programming languages (Java, JavaScript, Rust, Go, C++, C#) and task types beyond issue resolution. We plan to add support for other publicly available datasets, so that researchers and developers can use our platform as their one-stop-shop of code datasets. We're also building custom datasets on commission for training runs with specific requirements. If you need tailored data for your code models, reach out.

In the longer run, we will start rolling out better and stronger verifiers which aim to both reduce the time it takes to verify solutions as well as improve the confidence in the evaluation.

## Try It Now

Sign up at [codeset.ai](https://codeset.ai) to get $5 in free credits. The platform is pay-as-you-go with no minimum commitment.

Install the SDK:
```bash
pip install codeset
```

Get started with a simple example:
```python
from codeset import Codeset
import time

# Initialize client
client = Codeset(api_key="your_api_key")

# Create a session for a Python task
session = client.sessions.create(
    dataset="codeset-gym-python",
    sample_id="matiasb__python-unidiff-19"
)

# Execute commands in the sandboxed environment
response = client.sessions.execute_command(
    session_id=session.session_id,
    command="ls -lah"
)
print(response.stdout)

# Start verification
verify = client.sessions.verify.start(session_id=session.session_id)

# Poll for verification completion
while True:
    status = client.sessions.verify.status(
        job_id=verify.job_id,
        session_id=session.session_id
    )
    if status.status in ["completed", "error", "cancelled"]:
        break
    time.sleep(1)

# Check result
if status.result:
    print(f"Success: {status.result.is_success}")
    print(f"Tests: {status.result.passed}/{status.result.total}")

# Close session
client.sessions.close(session_id=session.session_id)
```

Read our [documentation](https://docs.codeset.ai) to learn more about the SDK, session lifecycle, and verification system.

We're building this for research teams and practitioners working on the next generation of code agents. If that's you, we'd love to hear your feedback.

---

1. nebius/SWE-rebench, SWE-Gym/SWE-Gym, R2E-Gym/R2E-Gym-V1, SWE-bench/SWE-bench, ScaleAI/SWE-bench\_Pro
