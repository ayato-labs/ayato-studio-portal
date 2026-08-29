import asyncio
import inspect


def pytest_pyfunc_call(pyfuncitem):
    """
    pytest-asyncioプラグインに依存せず、すべての非同期テスト(`async def`)を
    標準ライブラリの `asyncio.run` でラップして実行するための共通フック。
    """
    if inspect.iscoroutinefunction(pyfuncitem.obj):
        # fixturesの引数を抽出し、非同期関数に渡す
        funcargs = pyfuncitem.funcargs
        testargs = {arg: funcargs[arg] for arg in pyfuncitem._fixtureinfo.argnames}
        asyncio.run(pyfuncitem.obj(**testargs))
        return True  # 標準のテスト呼び出しをバイパスする


import pytest

from core.service_container import ServiceContainer


@pytest.fixture
def container():
    c = ServiceContainer()
    yield c
    # Clean up if needed (async close)
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.ensure_future(c.close_all())
        else:
            asyncio.run(c.close_all())
    except Exception:
        pass
