import { Application, IBoot } from "egg";
import Server from "./lib/discovery/server";
import { getGroup } from "./lib/discovery/group";
import Controller from "./lib/etcd/controller";

export default class FooBoot implements IBoot {

    private readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    configDidLoad() {
        const etcdConfig = this.app.config.etcd;
        if (process.env.SERVER_WEIGHT) etcdConfig.serverWeight = parseInt(process.env.SERVER_WEIGHT);
        if (process.env.SERVER_IP) etcdConfig.serverIp = process.env.SERVER_IP;
        if (process.env.NODE_NAME) etcdConfig.nodeName = process.env.NODE_NAME;
        if (process.env.SERVER_NAME) etcdConfig.serverName = process.env.SERVER_NAME;
    }

    async didLoad() {
        this.app.etcd = new Controller(this.app)
    }

    async didReady() {
        this.app.messenger.on('discovery', ({ name, type, server }: { name: string, type: string, server: Server }) => {
            console.log(name, type, server)
            getGroup(this.app, name)[type](new Server(server.name, server.ip, server.weight))
        });
    }

}