import asyncio
import inspect
import logging
from sanic import Sanic, Blueprint, response
from asyncio import CancelledError
from sanic.request import Request
from sanic.response import HTTPResponse
from typing import Text, Callable, Awaitable

from rasa.core.channels.channel import (
    InputChannel,
    CollectingOutputChannel,
    UserMessage
)

logger = logging.getLogger(__name__)

class MyIO(InputChannel):
    def name(name) -> Text:
        return "myio"
    
    def blueprint(
            self, on_new_message: Callable[[UserMessage], Awaitable[None]]
    ) -> Blueprint:
        
        custom_webhook = Blueprint(
            f"custom_webhook_{type(self).__name__}",
            inspect.getmodule(self).__name__,
        )

        @custom_webhook.route("/", methods=["GET"])
        async def health(request: Request) -> HTTPResponse:
            return response.json({ "status": "ok"})
        
        @custom_webhook.route("/webhook", methods=["POST"])
        async def receive(request: Request) -> HTTPResponse:
            sender_id = request.json.get("sender")
            text = request.json.get("message")
            input_channel = self.name()
            metadata = { "access-token": request.headers.get("Authorization") }

            collector = CollectingOutputChannel()

            try:
              await on_new_message(
                UserMessage(
                  text,
                  collector,
                  sender_id,
                  input_channel=input_channel,
                  metadata=metadata,
                )
              )
            except CancelledError:
              logger.error(
                f"Message handling timed out for " f"user message '{text}'."
              )
            except Exception:
              logger.exception(
                f"An exception occured while handling "
                f"user message '{text}'."
              )

            return response.json(collector.messages)
        
        return custom_webhook