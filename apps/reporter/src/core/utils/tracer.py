import datetime
import json
import logging
import os
from typing import Any


class ExecutionTracer:
    """
    実行履歴を構造化データ(JSONL)として記録するシングルトンクラス。
    テキストログ(logging)とは別に、分析用データとしての「帳簿」を管理する。
    """

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, log_dir: str = "logs", run_id: str | None = None):
        # シングルトンなので初期化は一度だけ
        if hasattr(self, "_initialized"):
            return

        self.log_dir = log_dir
        self.history_dir = os.path.join(log_dir, "history")
        self.run_id = run_id or datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        if not os.path.exists(self.history_dir):
            os.makedirs(self.history_dir, exist_ok=True)

        self._initialized = True
        logging.info(
            f"ExecutionTracer initialized. Run ID: {self.run_id}, Storage: {self.history_dir}"
        )

    def _get_daily_log_path(self):
        """今日の日付に基づいたファイルパスを取得する"""
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        return os.path.join(self.history_dir, f"trace_{today}.jsonl")

    def _append_log(self, event_type: str, data: dict[str, Any]):
        """JSONLファイルに追記する"""
        entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "run_id": self.run_id,
            "event_type": event_type,
            **data,
        }
        try:
            log_file = self._get_daily_log_path()
            with open(log_file, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
            # Mirror to standard logging for Cloud Run visibility
            logging.info(f"[Tracer] {event_type}: {json.dumps(data, ensure_ascii=False)}")
        except Exception as e:
            logging.error(f"Failed to write execution log: {e}")

    def log_execution_start(self, market: str):
        self._append_log("execution_start", {"market": market})

    def log_filing_found(self, market: str, company_name: str, code: str, doc_info: str):
        self._append_log(
            "filing_found",
            {
                "market": market,
                "company_name": company_name,
                "code": code,
                "doc_info": doc_info,
            },
        )

    def log_ai_score(
        self,
        market: str,
        company_name: str,
        score: int,
        threshold: int,
        reason: str | None = None,
    ):
        """AIによる注目度判定スコアを記録"""
        self._append_log(
            "ai_score_check",
            {
                "market": market,
                "company_name": company_name,
                "score": score,
                "threshold": threshold,
                "passed": score >= threshold,
                "reason": reason,
            },
        )

    def log_report_generated(self, market: str, company_name: str, report_length: int):
        self._append_log(
            "report_generated",
            {
                "market": market,
                "company_name": company_name,
                "report_length": report_length,
            },
        )

    def log_post_result(self, platform: str, success: bool, details: str = ""):
        self._append_log(
            "post_result",
            {"platform": platform, "success": success, "details": details},
        )

    def log_error(self, market: str, company_name: str, error_message: str):
        self._append_log(
            "error",
            {"market": market, "company_name": company_name, "error": error_message},
        )
