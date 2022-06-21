import { Button, Collapse, Checkbox, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
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

  const [formatState, setFormatState] = useState({
    actividades: {
      actividadPrimaria: "",
      actividadSecundaria: "",
      actividadFaltante: "",
    },
    proteccion: {
      guantes: false,
      chaleco: false,
      botas: false,
      casco: false,
      mascara: false,
      gafas: false,
      arnes: false,
    },
    capacitacion: {
      alturas: false,
      electricos: false,
      auxilios: false,
      maquinas: false,
    },
    bienestar: {
      dolorCabeza: false,
      dolorBrazos: false,
      dolorAbdominal: false,
      dolorPiernas: false,
      animo: false,
      familiares: false,
      emociones: false,
    },
    descanso: {
      dormirTimestamp: new Date().getTime(),
      despertarTimestamp: new Date().getTime(),
      casado: false,
    }
  })

  const handleRequestAccessWorker = async () => {
    const result = tx(writeContracts.HealthOcupational.PedirAcceso(), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" Success ");
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  const handleCreateWorkerSC = async () => {
    const result = tx(writeContracts.HealthOcupational.NuevoContratoDiario(), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" Success ");
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  const handlePostWorkerData = async () => {
    const result = tx(writeContracts.WorkerSC.DatosEntradaTrabajo(
      JSON.stringify((formatState))
    ), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" Success ");
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  const allTrue = (array) => {
    return array.filter((item) => item).length === array.length;
  }

  const atleastOneTrue = (array) => {
    return array.filter((item) => item).length > 0;
  }

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

        <Divider />

        <div style={{ margin: 8, textAlign: "left" }}>
          {/* ACTIVIDADES */}
          <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel header={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Actividades
              </div>
            } key="1">
              <h4>
                Actividad Primaria <Input onChange={(e) => setFormatState({ ...formatState, actividades: { ...formatState.actividades, actividadPrimaria: e.target.value } })} placeholder="Escribe tu actividad primaria" />
              </h4>
              <h4>
                Actividad Secundaria <Input onChange={(e) => setFormatState({ ...formatState, actividades: { ...formatState.actividades, actividadSecundaria: e.target.value } })} placeholder="Escribe tu actividad secundaria" />
              </h4>
              <h4>
                Actividad Faltante <Input onChange={(e) => setFormatState({ ...formatState, actividades: { ...formatState.actividades, actividadFaltante: e.target.value } })} placeholder="Escribe tu actividad faltante" />
              </h4>
            </Collapse.Panel>
          </Collapse>

          {/* PROTECCIÓN */}
          <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel header={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Protección
                <Checkbox
                  checked={allTrue(Object.values(formatState.proteccion))}
                  indeterminate={atleastOneTrue(Object.values(formatState.proteccion)) && !allTrue(Object.values(formatState.proteccion))}
                  // onChange={() => {
                  //   let _proteccion = formatState.proteccion;
                  //   Object.keys(formatState.proteccion).forEach(key => {
                  //     _proteccion[key] = atleastOneTrue(Object.values(formatState.proteccion)) && !allTrue(Object.values(formatState.proteccion)) ? true : false
                  //   })
                  //   setFormatState({ ...formatState, proteccion: _proteccion })
                  // }}
                ></Checkbox>
              </div>
            } key="1">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Usa guantes de protección?
                <Checkbox checked={formatState.proteccion.guantes} onChange={() => setFormatState({ ...formatState, proteccion: { ...formatState.proteccion, guantes: !formatState.proteccion.guantes } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Usa chaleco reflectivo?
                <Checkbox checked={formatState.proteccion.chaleco} onChange={() => setFormatState({ ...formatState, proteccion: { ...formatState.proteccion, chaleco: !formatState.proteccion.chaleco } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Usa botas inductriales?
                <Checkbox checked={formatState.proteccion.botas} onChange={() => setFormatState({ ...formatState, proteccion: { ...formatState.proteccion, botas: !formatState.proteccion.botas } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Usa casco de protección?
                <Checkbox checked={formatState.proteccion.casco} onChange={() => setFormatState({ ...formatState, proteccion: { ...formatState.proteccion, casco: !formatState.proteccion.casco } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Usa máscara facial de protección?
                <Checkbox checked={formatState.proteccion.mascara} onChange={() => setFormatState({ ...formatState, proteccion: { ...formatState.proteccion, mascara: !formatState.proteccion.mascara } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Usa gafas de protección?
                <Checkbox checked={formatState.proteccion.gafas} onChange={() => setFormatState({ ...formatState, proteccion: { ...formatState.proteccion, gafas: !formatState.proteccion.gafas } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Usa arnés para trabajar en la altura?
                <Checkbox checked={formatState.proteccion.arnes} onChange={() => setFormatState({ ...formatState, proteccion: { ...formatState.proteccion, arnes: !formatState.proteccion.arnes } })}></Checkbox>
              </div>
            </Collapse.Panel>
          </Collapse>
          
          {/* CAPACITACION */}
          <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel header={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Capacitación
                <Checkbox
                  checked={allTrue(Object.values(formatState.capacitacion))}
                  indeterminate={atleastOneTrue(Object.values(formatState.capacitacion)) && !allTrue(Object.values(formatState.capacitacion))}
                ></Checkbox>
              </div>
            } key="1">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Capacitación en alturas vigente?
                <Checkbox checked={formatState.capacitacion.alturas} onChange={() => setFormatState({ ...formatState, capacitacion: { ...formatState.capacitacion, alturas: !formatState.capacitacion.alturas } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Capacitación de riesgos eléctricos?
                <Checkbox checked={formatState.capacitacion.electricos} onChange={() => setFormatState({ ...formatState, capacitacion: { ...formatState.capacitacion, electricos: !formatState.capacitacion.electricos } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Capacitación de primeros auxilios y uso del botequín?
                <Checkbox checked={formatState.capacitacion.auxilios} onChange={() => setFormatState({ ...formatState, capacitacion: { ...formatState.capacitacion, auxilios: !formatState.capacitacion.auxilios } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Capacitación para uso de máquinas?
                <Checkbox checked={formatState.capacitacion.maquinas} onChange={() => setFormatState({ ...formatState, capacitacion: { ...formatState.capacitacion, maquinas: !formatState.capacitacion.maquinas } })}></Checkbox>
              </div>
            </Collapse.Panel>
          </Collapse>

          {/* BIENESTAR */}
          <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel header={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Bienestar Físico y Mental
                <Checkbox
                  checked={allTrue(Object.values(formatState.bienestar))}
                  indeterminate={atleastOneTrue(Object.values(formatState.bienestar)) && !allTrue(Object.values(formatState.bienestar))}
                ></Checkbox>
              </div>
            } key="1">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Presenta dolor de cabeza?
                <Checkbox checked={formatState.bienestar.dolorCabeza} onChange={() => setFormatState({ ...formatState, bienestar: { ...formatState.bienestar, dolorCabeza: !formatState.bienestar.dolorCabeza } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Presenta dolor de brazos?
                <Checkbox checked={formatState.bienestar.dolorBrazos} onChange={() => setFormatState({ ...formatState, bienestar: { ...formatState.bienestar, dolorBrazos: !formatState.bienestar.dolorBrazos } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Presenta dolor abdominal?
                <Checkbox checked={formatState.bienestar.dolorAbdominal} onChange={() => setFormatState({ ...formatState, bienestar: { ...formatState.bienestar, dolorAbdominal: !formatState.bienestar.dolorAbdominal } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Presenta dolor de piernas?
                <Checkbox checked={formatState.bienestar.dolorPiernas} onChange={() => setFormatState({ ...formatState, bienestar: { ...formatState.bienestar, dolorPiernas: !formatState.bienestar.dolorPiernas } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Se ha sentido bajo de ánimo o triste los últimos 2 días?
                <Checkbox checked={formatState.bienestar.animo} onChange={() => setFormatState({ ...formatState, bienestar: { ...formatState.bienestar, animo: !formatState.bienestar.animo } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Siente que tiene problemas familiares?
                <Checkbox checked={formatState.bienestar.familiares} onChange={() => setFormatState({ ...formatState, bienestar: { ...formatState.bienestar, familiares: !formatState.bienestar.familiares } })}></Checkbox>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Ha sufrido de emocionees fuertes los últimos dos días?
                <Checkbox checked={formatState.bienestar.emociones} onChange={() => setFormatState({ ...formatState, bienestar: { ...formatState.bienestar, emociones: !formatState.bienestar.emociones } })}></Checkbox>
              </div>
            </Collapse.Panel>
          </Collapse>

          {/* SUEÑO Y DESCANSO */}
          <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel header={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Sueño y descanso
              </div>
            } key="1">
              <h4>
                Hora de dormir <Input onChange={(e) => setFormatState({ ...formatState, actividades: { ...formatState.actividades, actividadPrimaria: e.target.value } })} placeholder="Escribe tu actividad primaria" />
              </h4>
              <h4>
                Hora en la que despertó <Input onChange={(e) => setFormatState({ ...formatState, actividades: { ...formatState.actividades, actividadSecundaria: e.target.value } })} placeholder="Escribe tu actividad secundaria" />
              </h4>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                ¿Se siente cansado?
                <Checkbox checked={formatState.descanso.cansado} onChange={() => setFormatState({ ...formatState, descanso: { ...formatState.descanso, cansado: !formatState.descanso.cansado } })}></Checkbox>
              </div>
            </Collapse.Panel>
          </Collapse>

          <Button
            style={{ marginTop: 8 }}
            onClick={handlePostWorkerData}
          >
            Enviar datos
          </Button>
        </div>

        <Divider />

        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <div>OR</div>
        <Balance address={address} provider={localProvider} price={price} />
        
        <Divider />

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
    </div>
  );
}
