/*
 * Copyright (C) 2018 The 'MysteriumNetwork/mysterion' Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { action, reaction } from 'mobx'
import { ConnectionIPDTO } from 'mysterium-tequilapi'
import { ConnectionStatusEnum } from '../libraries/tequil-api/enums'
import TequilApiState from '../libraries/tequil-api/tequil-api-state'
import { FetcherBase } from './fetcher-base'

type ConnectionIP = () => Promise<ConnectionIPDTO>

export class IPFetcher extends FetcherBase<ConnectionIPDTO> {
  constructor (private connectionIP: ConnectionIP, private readonly tequilApiState: TequilApiState) {
    super('IP')

    reaction(() => this.tequilApiState.connectionStatus, () => {
      if (
        this.tequilApiState.status === ConnectionStatusEnum.CONNECTED ||
        this.tequilApiState.status === ConnectionStatusEnum.NOT_CONNECTED
      ) {
        this.refresh().catch(error => {
          console.error('IPFetcher refresh failed:', error)
        })
      }
    })
  }

  protected get canRun (): boolean {
    if (!this.tequilApiState.IP) {
      return true
    }

    return this.tequilApiState.connectionStatus.status !== ConnectionStatusEnum.NOT_CONNECTED
  }

  protected async fetch (): Promise<ConnectionIPDTO> {
    return this.connectionIP()
  }

  @action
  protected update (newIP: ConnectionIPDTO) {
    this.tequilApiState.IP = newIP.ip
  }
}
