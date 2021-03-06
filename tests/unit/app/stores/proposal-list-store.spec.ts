/*
 * Copyright (C) 2019 The "mysteriumnetwork/mysterium-vpn-mobile" Authors.
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

import { autorun } from 'mobx'
import { ProposalItem } from '../../../../src/app/models/proposal-item'
import { ServiceType } from '../../../../src/app/models/service-type'
import { ProposalListStore, ProposalsSorting } from '../../../../src/app/stores/proposal-list-store'
import { proposalListItemData } from '../../fixtures/proposal-list-item-data'

describe('ProposalListStore', () => {
  let allProposals: ProposalItem[]
  let store: ProposalListStore

  beforeEach(() => {
    allProposals = proposalListItemData
    store = new ProposalListStore(allProposals)
  })

  describe('.currentProposals', () => {
    describe('when using default sorting by country name', () => {
      beforeEach(() => {
        function buildProposal (countryName: string | null, quality: number | null, isFavorite: boolean) {
          return {
            id: '1',
            providerID: '',
            serviceType: ServiceType.Wireguard,
            countryCode: null,
            countryName,
            isFavorite,
            quality
          }
        }

        allProposals = [
          buildProposal('Albania', null, false),
          buildProposal('Italy', 0.1, false),
          buildProposal('Italy', 0.2, false),
          buildProposal('Lithuania', null, true)
        ]
        store = new ProposalListStore(allProposals)
      })

      it('returns sorted proposals by country name, favorites first', () => {
        const countryNames = store.currentProposals.map((i) => i.countryName)
        expect(countryNames).toEqual(['Lithuania', 'Albania', 'Italy', 'Italy'])
      })

      it('returns higher-quality proposals first for same country', () => {
        const italyProposals = store.currentProposals.slice(2, 4)
        expect(italyProposals).toHaveLength(2)
        italyProposals.forEach(proposal => {
          expect(proposal.countryName).toEqual('Italy')
        })
        expect(italyProposals[0].quality).toEqual(0.2)
        expect(italyProposals[1].quality).toEqual(0.1)
      })
    })

    describe('when sorting by quality', () => {
      beforeEach(() => {
        function buildProposal (quality: number | null, isFavorite: boolean) {
          return {
            id: '1',
            providerID: '',
            serviceType: ServiceType.Wireguard,
            countryCode: null,
            countryName: null,
            isFavorite,
            quality
          }
        }
        allProposals = [
          buildProposal(0.1, false),
          buildProposal(0.9, false),
          buildProposal(null, false),
          buildProposal(0.4, true)
        ]
        store = new ProposalListStore(allProposals)
      })

      it('returns sorted proposals by quality and favorite flag', () => {
        store.sorting = ProposalsSorting.ByQuality

        const proposals = store.currentProposals
        expect(proposals.map(proposal => proposal.quality)).toEqual([0.4, 0.9, 0.1, null])
      })

      it('notifies observers about changed order', () => {
        let receivedProposals: ProposalItem[] = []
        const dispose = autorun(() =>
          receivedProposals = store.currentProposals
        )

        store.sorting = ProposalsSorting.ByQuality

        expect(receivedProposals.map(proposal => proposal.quality)).toEqual([0.4, 0.9, 0.1, null])

        dispose()
      })
    })

    it('returns filtered proposals after filtering', () => {
      let proposals = null
      autorun(() => {
        proposals = store.currentProposals
      })

      store.textFilter = 'Lithuania'
      expect(proposals).toHaveLength(2)

      store.serviceTypeFilter = ServiceType.Wireguard
      expect(proposals).toHaveLength(1)
    })

  })

  describe('.serviceFilterOptions', () => {
    it('returns options for filtering by all or by service type', () => {
      expect(store.serviceFilterOptions).toEqual([null, 'openvpn', 'wireguard'])
    })
  })

  describe('.proposalsCountByServiceType', () => {
    it('returns number of all proposals filtered by text', () => {
      store.textFilter = 'Lithuania'
      store.serviceTypeFilter = ServiceType.Wireguard

      expect(store.proposalsCountByServiceType()).toEqual(2)
    })

    it('returns number of proposals filtered by text and service type', () => {
      store.textFilter = 'Lithuania'
      store.serviceTypeFilter = ServiceType.Wireguard

      expect(store.proposalsCountByServiceType(ServiceType.Openvpn)).toEqual(1)
    })
  })
})
