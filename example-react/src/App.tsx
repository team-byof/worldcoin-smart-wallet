'use client'
import {useCallback} from 'react'
import Background from './layouts/background'
import { CredentialType, IDKitWidget, ISuccessResult, solidityEncode } from "@worldcoin/idkit";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
const action = "byof"
const appID = "app_staging_23b713ea1ef2e814d19b3550de74409f"
const signal = "my_signal"
const credentialType = CredentialType.Phone

export function Home(): JSX.Element {
  const navigate = useNavigate();

  const [cred, saveCred] = useLocalStorage("worldcoin", null);

  const handleProof = useCallback((result: ISuccessResult) => {
		return new Promise<void>((resolve) => {
			setTimeout(() => resolve(), 3000);
			// NOTE: Example of how to decline the verification request and show an error message to the user
		});
	}, []);

  if (cred) {
    navigate('/execute')
  }

	const onSuccess = (result: ISuccessResult) => {
		console.log(result);
    const u = {
      ...result,
      action,
      app_id: appID,
      signal,
      credential_type: credentialType,
    }
    saveCred(u)
    navigate(`/execute`)
	};

  return (
    <div className="flex flex-col text-center">
      <div className="space-y-2 p-8">
        <h3 className="text-3xl text-gray-700 font-semibold text-center">
        Cross-chain Worldcoin AA Wallet 👀
        </h3>
        <h5 className="text text-gray-500 font text-center">
        Bye bye private keys! 👋 <br /> <br />Chain-agnostic account abstraction wallet using Worldcoin.
        </h5>
      </div>
        <div className="py-8 h-1/3 border-4 rounded-2xl hover:bg-pink-100 border-pink-300">
            <IDKitWidget
              action={solidityEncode(['uint256'], [action])}
              signal={solidityEncode(['address'], ["0xcCC05d9631e7B0F1E5629A62E79A9F1C84ad5dC5"])}
              onSuccess={onSuccess}
              handleVerify={handleProof}
              app_id={appID}
              credential_types={[credentialType]}
              // walletConnectProjectId="get_this_from_walletconnect_portal"
            >
              {({ open }) => <button onClick={open} className="text-2xl">👀 Sign in with Worldcoin</button>}
            </IDKitWidget>
          </div>
    </div>
  )
}

export default function HomeRoot() {
  return (
    <Background>
      <Home />
    </Background>
  )
}