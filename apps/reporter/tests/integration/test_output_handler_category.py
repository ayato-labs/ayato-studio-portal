from unittest.mock import AsyncMock, MagicMock

import pytest

from core.interfaces.plugin import ReportArtifact
from core.output_handler import OutputHandler


@pytest.mark.asyncio
async def test_output_handler_partial_database_failure():
    """System Test: OutputHandler survives when DB fails for some artifacts but succeeds for others."""
    container = MagicMock()
    container.database.save_report = AsyncMock()

    # 1st call fails, 2nd succeeds
    container.database.save_report.side_effect = [Exception("DB CRASH"), True]

    container.compliance_validator.validate.return_value = (True, [])

    handler = OutputHandler(container)

    artifacts = [
        ReportArtifact(
            title="Bad News", content="C1", filename="f1.html", category="c1", market="m1"
        ),
        ReportArtifact(
            title="Good News", content="C2", filename="f2.html", category="c2", market="m2"
        ),
    ]

    # Should not raise exception
    await handler.process_artifacts(artifacts)

    # Verify both were attempted
    assert container.database.save_report.call_count == 2
    print("SUCCESS: OutputHandler handled partial DB failure.")


@pytest.mark.asyncio
async def test_output_handler_compliance_crash():
    """System Test: OutputHandler continues if compliance validator crashes."""
    container = MagicMock()
    container.database.save_report = AsyncMock()

    # Compliance validator crashes
    container.compliance_validator.validate.side_effect = Exception("Validator Bug")

    handler = OutputHandler(container)

    artifact = ReportArtifact(
        title="Test", content="C", filename="f.html", category="c", market="m"
    )

    await handler.process_artifacts([artifact])

    # Should still attempt to save to DB
    assert container.database.save_report.called
    print("SUCCESS: OutputHandler survived compliance validator crash.")
