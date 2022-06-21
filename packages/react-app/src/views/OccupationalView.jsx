import { Button, Divider } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";

import { Address, Balance, Events } from "../components";

export default function OccupationalView({
  purpose,
  name,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [requestsList, setRequestsList] = useState([]);

  const handleRegisterOccupational = async () => {
    const result = tx(writeContracts.HealthOcupational.CrearSaludOcupacional(), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" Success ");
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  }

  const handleShowRequests = async () => {
    const result = tx(writeContracts.HealthOcupational.ObservarSolicitudes(), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" Success ");
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    const logresult = await result;
    setRequestsList(logresult);
  };

  const handleWorkerAccessClick = async (address) => {
    const result = tx(writeContracts.HealthOcupational.ConcederAccesoTrabajador(address), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" Success ");
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    const logresult = await result;
    console.log(logresult);
  }

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Salud Ocupacional</h2>
        <Button onClick={handleRegisterOccupational}>Registrarse blockchain</Button>
        <Button onClick={handleShowRequests}>Mostrar Requests de workers</Button>
        <div>
          {requestsList && requestsList?.length > 0 && (requestsList.map((request)=><div>{request} <Button onClick={()=>handleWorkerAccessClick(request)}>Accept</Button></div>))}
        </div>

        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />

        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <div>OR</div>
        <Balance address={address} provider={localProvider} price={price} />
        Your Contract Address:
        <Address
          address={readContracts && readContracts.YourContract ? readContracts.YourContract.address : null}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <Events
        contracts={readContracts}
        contractName="HealthOcupational"
        eventName="NewOHDirection"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />
    </div>
  );
}
