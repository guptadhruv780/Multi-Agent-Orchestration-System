"""WebSocket endpoint (full implementation in Chapter 9)."""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


@router.websocket("/ws/{run_id}")
async def websocket_endpoint(websocket: WebSocket, run_id: str) -> None:
    await websocket.accept()
    try:
        await websocket.send_json(
            {
                "type": "agent_log",
                "run_id": run_id,
                "agent": "system",
                "level": "info",
                "message": "WebSocket stub: connect after Chapter 9 wiring.",
            }
        )
    except WebSocketDisconnect:
        return
    finally:
        await websocket.close()
