import WebSocket, { Server }  from "ws";

const s = new Server({ port: 5001 });

class Players {
  players: Player[] = [];

  sendMessage(id: string, message: string) {
    this.players.forEach(it => it.sendMessage(id, message));
  }

  sendPosition(id: string, position: { x: number, y: number }) {
    this.players.forEach(it => it.sendPosition(id, position));
  }

  add(player: Player) {
    this.players.push(player);
    console.log(this.players.map(it => it.id));
  }

  remove(id: string) {
    this.players = this.players.filter(it => it.id !== id);
    console.log(this.players.map(it => it.id));
  }

  findById(id: string) {
    return this.players.find(it => it.id === id);
  }
}

class Player {
  id: string;
  ws: WebSocket;
  position: { x: number, y: number } = { x: 0, y: 0 };

  constructor(id: string, ws: WebSocket) {
    this.id = id;
    this.ws = ws;
  }

  sendMessage(id: string, message: string) {
    this.send("message", id, { message });
  }

  sendPosition(id: string, position: { x: number, y: number }) {
    this.send("move", id, { position });
  }

  send(type: string, id: string, param: any) {
    this.ws.send(JSON.stringify({ type, data: { ...param, id }}));
  }

  move(dx: number, dy: number): { x: number, y: number } {
    const {x, y} = this.position;
    return this.position = { x: x + dx, y: y + dy };
  }
}

type Observer<T1 = undefined> = (id: string, arg: T1) => void;

class Observable {
  observers: { [key: string]: Observer[] } = {}

  on(type: "message", cb: Observer<string>): void;
  on(type: "move", cb: Observer<{ dx: number, dy: number }>): void;
  on(type: string, cb: Observer<any>) {
    this.observers[type] = [...(this.observers[type] || []), cb];
  }

  emit(type: "message", id: string, arg: { message: string }): void;
  emit(type: "move", id: string, arg: { dx: number, dy: number }): void;
  emit(type: string, id: string, arg: any) {
    (this.observers[type] || []).forEach(it => it(id, arg));
  }
}

let players: Players = new Players();
const observable = new Observable();
observable.on("message", (id, message) => players.sendMessage(id, message));
observable.on("move", (id, position) => {
  const {dx, dy} = position;
  players.sendPosition(id, players.findById(id)?.move(dx, dy) || { x: 0, y: 0 });
});

s.on("connection", ws => {
  const _id = id();
  ws.on("message", message => {
    const { type, data } = JSON.parse(message.toString());
    observable.emit(type, _id, data);
  });
  ws.on("close", () => players.remove(_id));
  players.add(new Player(_id, ws));

});

/**
 * @param {number} num
 * @returns {number[]}
 */
function range(num: number): null[] {
  return Array(num).fill(null);
}

const BASE = "abcdefghijklmnopqrstuvwxyz";
/**
 * @returns {string}
 */
function id(): string {
  return range(5).map(_ => BASE[Math.floor(Math.random() * BASE.length)]).join("");
}
