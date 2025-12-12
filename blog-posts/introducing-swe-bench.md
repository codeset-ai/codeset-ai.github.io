---
title: "SWE-Bench Verified Is Now Live on Codeset"
date: "2025-12-12"
excerpt: "SWE-Bench Verified is now available on the Codeset platform, making the most widely used benchmark for evaluating real-world software engineering tasks easier than ever to run."
---

## Introducing SWE-Bench Verified on the Codeset Platform

We're excited to announce that **SWE-Bench Verified** is now available on the **Codeset platform**!

SWE-Bench Verified is the most widely adopted benchmark for evaluating code agents on real-world software engineering tasks and it is now easier than ever to run it.
With just a few lines of code, you can programatically setup a session with one of the 500 samples in SWE-Bench Verified, interact with it, and verify if the instance has been solved.

```python
import os
from codeset import Codeset

# Initialize client with your API key
client = Codeset(api_key=os.getenv("CODESET_API_KEY"))

# Create a session for a task
session = client.sessions.create(
    dataset="swe-bench-verified",
    sample_id="astropy__astropy-12907",
)

# Interact with the environment
response = client.sessions.execute_command(
    session_id=session.session_id,
    command="ls -lah"
)
print(response.stdout)

result = client.sessions.str_replace(
    session_id=session.session_id,
    file_path="astropy/modeling/separable.py",
    str_to_replace="cright[-right.shape[0]:, -right.shape[1]:] = 1",
    str_to_insert="cright[-right.shape[0]:, -right.shape[1]:] = right"

)
print(result)

# Run the tests and verify the solution
verify = client.sessions.verify.start(session_id=session.session_id)
assert verify.result.is_success
print("Verification successful!")

client.sessions.close(session_id=session.session_id)
```

You can start running evaluations immediately and integrate them directly into your benchmarking pipeline. Whether you are already using SWE-Bench Verified or just getting started, Codeset provides the easiest way to run and scale your evaluations.

Sign up today and get $5 free credits to try out running your evaluations on the Codeset platform!

## Fixing issues with the SWE-Bench Dataset

While integrating SWE-Bench Verified into our platform, we encountered several problematic instances that have also been identified by the community:

- **psf__requests-1724**: [#324](https://github.com/SWE-bench/SWE-bench/issues/324), [#484](https://github.com/SWE-bench/SWE-bench/issues/484)
- **django__django-10097**: [#487](https://github.com/SWE-bench/SWE-bench/issues/487)
- **astropy__astropy-8707**: [#484](https://github.com/SWE-bench/SWE-bench/issues/484)
- **astropy__astropy-8872**: [#484](https://github.com/SWE-bench/SWE-bench/issues/484)

Additionally, we have fixed issues related to the `PASS_TO_PASS` and `FAIL_TO_PASS` test lists in our own version of the [SWE-bench Verified dataset on HuggingFace](https://huggingface.co/datasets/codeset/SWE-bench_Verified) for the following instances:

- **astropy__astropy-7606**
- **matplotlib__matplotlib-22719**
- **django__django-7530**: [#502](https://github.com/SWE-bench/SWE-bench/issues/502)

We believe maintaining a high-quality benchmark is essential for meaningful evaluations, and we're committed to helping improve SWE-Bench for the entire community.

