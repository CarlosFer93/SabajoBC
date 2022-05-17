import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

export default function WorkerView({
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
  const [newPurpose, setNewPurpose] = useState("loading...");
  const [newName, setNewName] = useState("loading fulanito...");

  const handleRequestAccessWorker = async () => {
    /* look how you call setPurpose on your contract: */
    /* notice how you pass a call back for tx updates too */
    const result = tx(writeContracts.HealthOcupational.RequestAccess(), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
        );
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  const handleCreateWorkerSC = async () => {
    const result = tx(writeContracts.HealthOcupational.NewWorkerSC(), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
        );
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Worker</h2>
        <Button onClick={handleRequestAccessWorker}>Solicitar Acceso a la Empresa</Button>
        <br />
        <Button onClick={handleCreateWorkerSC}>Crear Contrato del Trabajador</Button>
        {/* string memory newPrimaryActivity, string memory newSecundaryActivity, 
        string memory newMissingActivity, bool newProtection, bool newCapacitation, 
        bool newFMWelfare, bool newPsySub, bool newCorporalPain, bool newSleep */}
        {/* <h4>purpose: {purpose}</h4>
        <h4>name: {name}</h4> */}
        <Divider />
        <div style={{ margin: 8, textAlign: "left" }}>
          <h4>
            Actividad Primaria <Input placeholder="Escribe tu actividad primaria" />
          </h4>
          <h4>
            Actividad Secundaria <Input placeholder="Escribe tu actividad secundaria" />
          </h4>
          <h4>
            Actividad Faltante <Input placeholder="Escribe tu actividad faltante" />
          </h4>
          <h4>
             Protección <Switch />
          </h4>
          <h4>
             Capacitación <Switch />
          </h4>
          <h4>
             Bienestar Físico y Mental <Switch />
          </h4>
          <h4>
             Sustancias Psicoactivas <Switch />
          </h4>
          <h4>
             Dolor Corporal <Switch />
          </h4>
          <h4>
             Insomnio <Switch />
          </h4>
          {/* <Input
            placeholder="Purpose"
            onChange={e => {
              setNewPurpose(e.target.value);
            }}
          />
          <Input
            placeholder="Name"
            onChange={e => {
              setNewName(e.target.value);
            }} 
          />*/}
          {/* TODO: Call a function to publish the worker sc contract with this data */}
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.YourContract.setPurpose(newPurpose, newName), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Enviar datos
          </Button>
        </div>
        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        {/* <Divider /> */}
        {/* ENS Address Example:
        <Address
          address="0x34aA3F359A9D614239015126635CE7732c18fDF3"
          ensProvider={mainnetProvider}
          fontSize={16}
        /> */}
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <div>OR</div>
        <Balance address={address} provider={localProvider} price={price} />
        {/* <Divider />
        <div>🐳 Example Whale Balance:</div>
        <Balance balance={utils.parseEther("1000")} provider={localProvider} price={price} /> */}
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        {/* <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <Divider /> */}
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
        eventName="AccessRequests"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />

      <Events
        contracts={readContracts}
        contractName="HealthOcupational"
        eventName="NewSContract"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />

      {/* <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        <Card>
          Check out all the{" "}
          <a
            href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            📦 components
          </a>
        </Card>

        <Card style={{ marginTop: 32 }}>
          <div>
            There are tons of generic components included from{" "}
            <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
              🐜 ant.design
            </a>{" "}
            too!
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary">Buttons</Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <SyncOutlined spin /> Icons
          </div>

          <div style={{ marginTop: 8 }}>
            Date Pickers?
            <div style={{ marginTop: 2 }}>
              <DatePicker onChange={() => {}} />
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Slider range defaultValue={[20, 50]} onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Switch defaultChecked onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{ marginTop: 32 }}>
            <Spin />
          </div>
        </Card>
      </div> */}
    </div>
  );
}
