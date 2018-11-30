import { reaction } from 'mobx'
import firebase from 'react-native-firebase'
import TequilApiState from '../libraries/tequil-api/tequil-api-state'
import VpnAppState from './vpn-app-state'
import {Platform} from "react-native";

const anal = firebase.analytics()
// const crash = firebase.crashlytics()

export default class Logger {
  private loggingStarted: boolean = false
  private originalInfo: (...args: Object[]) => void
  // private originalWarn: (...args: Object[]) => void

  constructor (private readonly tequilApiState: TequilApiState, private readonly vpnAppState: VpnAppState) {
    //TODO: this is temporary for testing purpose
    this.originalInfo = console.info
    console.info = async (...args: Object[]) => {
      this.originalInfo(...args)
      try {
        await anal.logEvent("console_info", { a: 123, platform: Platform.OS })
      } catch (e) {
        console.log('error while logEvent', e)
      }
    }

    //TODO: remove or enable crashlitics
    // this.originalWarn = console.warn
    // console.warn = async (...args: Object[]) => {
    //   this.originalWarn(...args)
    //   try {
    //     await crash.recordError(0, args[0].toString())
    //   } catch (e) {
    //     console.log('error while logEvent', e)
    //   }
    // }
  }

  public logObservableChanges (): void {
    if (this.loggingStarted) {
      return
    }
    this.loggingStarted = true

    reaction(() => this.tequilApiState.identityId, () => {
      this.info('Identity unlocked', this.tequilApiState.identityId)
    })

    reaction(() => this.tequilApiState.connectionStatus, () => {
      this.info('Connection status changed', this.tequilApiState.connectionStatus)
    })

    reaction(() => this.tequilApiState.IP, () => {
      this.info('IP changed', this.tequilApiState.IP)
    })

    reaction(() => this.tequilApiState.proposals, () => {
      this.info('Proposals updated', this.tequilApiState.proposals)
    })

    reaction(() => this.vpnAppState.selectedProviderId, () => {
      this.info('Selected provider ID selected', this.vpnAppState.selectedProviderId)
    })
  }

  private info (...args: any[]) {
    console.info('[LOG]', ...args)
  }
}
