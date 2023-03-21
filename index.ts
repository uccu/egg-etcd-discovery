import Server from "./lib/discovery/server"
import { getGroup, getGroups } from "./lib/discovery/group"

export { getGroup, getGroups }

interface EggRedisOptions {
  hosts: string[],
  leaseTTL: number,
  dialTimeout: number,
  serverName: string,
  nodeName: string,
  serverWeight: number,
  serverIp: string,
}

declare module 'egg' {
  interface EggApplication {
    options: {
      type: 'agent' | 'application'
    }
  }
  interface Application {
    etcd: {
      get(name: string): Server | null
      update(data: { serverName: string, nodeName: string, serverIp: string, weight: number }): Promise<void>
    }
  }

  export interface NewEggAppConfig {
    etcd: EggRedisOptions
  }
}


