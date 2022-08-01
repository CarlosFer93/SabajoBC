import { Button, Divider } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { collection } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';


import { Address, Balance, Events } from "../components";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";

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
  const eventsRef = collection(useFirestore(), "events")
  const { data, status } = useFirestoreCollectionData(eventsRef);

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

  if (status === 'loading') {
    return <p>Cargando...</p>;
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
          {requestsList && requestsList?.length > 0 && (requestsList[0].map((request, idx) => <div>{`${requestsList[1][idx]}_${requestsList[2][idx]}`} <Button onClick={() => handleWorkerAccessClick(request)}>Accept</Button></div>))}
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
        <ul>
          {
            data?.map(
              (event) => <li key={event.id}>{event.id}</li>
            )
          }
        </ul>
        {/* Counts the number of formats using chaleco */}
        <BarChart
          width={500}
          height={400}
          data={[
          ...Object.keys(data[0]?.form.proteccion || {}).map(item => ({
            name: `${item}`,
            value: data?.filter(
              ({ timestamp, form }) => form?.proteccion[item]
            ).length
          }))
        ]}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar type="monotone" dataKey="value" yAxisId={0} />
        </BarChart>
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
