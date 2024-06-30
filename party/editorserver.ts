import type * as Party from "partykit/server";

import { onConnect, type YPartyKitOptions } from "y-partykit";
import * as Y from "yjs";

import { SINGLETON_ROOM_ID } from "./types";

export default class editorserver implements Party.Server {
  yjsOptions: YPartyKitOptions = {};
  options: Party.ServerOptions = {
    hibernate: true,
  };
  constructor(public room: Party.Room) {}

  getOpts() {
    // options must match when calling unstable_getYDoc and onConnect
    const opts: YPartyKitOptions = {
      async load() {
        // load a document from a database, or some remote resource
        // and return a Y.Doc instance here (or null if no document exists)
        const doc = new Y.Doc();

        return doc;
      },
      callback: { handler: (doc) => this.handleYDocChange(doc) },
    };

    return opts;
  }

  async onConnect(conn: Party.Connection) {
    await this.updateCount();

    return onConnect(conn, this.room, this.getOpts());
  }

  async onClose(_: Party.Connection) {
    await this.updateCount();
  }

  handleYDocChange(_: Y.Doc) {
    // called on every ydoc change
    // no-op
  }

  async updateCount() {
    // Count the number of live connections
    const count = [...this.room.getConnections()].length;

    // Send the count to the 'rooms' party using HTTP POST
    await this.room.context.parties.rooms.get(SINGLETON_ROOM_ID).fetch({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: this.room.id, count }),
    });
  }
}
editorserver satisfies Party.Worker;
