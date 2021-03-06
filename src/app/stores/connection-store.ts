/*
 * Copyright (C) 2018 The "mysteriumnetwork/mysterium-vpn-mobile" Authors.
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

import { action, computed, observable } from 'mobx'
import Connection from '../domain/connection'
import ConnectionData from '../models/connection-data'

class ConnectionStore {
  @computed
  public get data (): ConnectionData {
    if (this._data === undefined) {
      throw new Error('Connection data is not yet available')
    }
    return this._data
  }

  @observable
  private _data?: ConnectionData

  constructor (public readonly connection: Connection) {
    this.connection.onDataChange(data => this.updateData(data))
  }

  @action
  private updateData (data: ConnectionData) {
    this._data = data
  }
}

export default ConnectionStore
