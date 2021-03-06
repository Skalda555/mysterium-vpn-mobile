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
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { Metrics } from 'mysterium-vpn-js'
import { ServiceType } from './service-type'

class Proposal {
  constructor (
    public readonly providerID: string,
    public readonly serviceType: ServiceType,
    public readonly countryCode: string | null,
    public readonly countryName: string | null,
    public readonly metrics: Metrics
  ) {}

  public get id (): string {
    return `${this.providerID}-${this.serviceType}`
  }
}

export default Proposal
