import { Avatar, Button, Card, Divider, Modal } from "antd";
import React, { useState } from "react";
import { collection } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import healthWorkerIcon from "../assets/images/health.png";
import { EyeOutlined } from '@ant-design/icons';

import { Address } from "../components";

export default function OccupationalView({
  address,
  mainnetProvider,
  tx,
  writeContracts,
}) {
  const [requestsList, setRequestsList] = useState([]);
  const [modalWorkerSummaryVisible, setModalWorkerSummaryVisible] = useState(false);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

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

  const renderInfoByCodigo = () => {
    let currentCodigoData = data.filter(({ form }) => form.codigo === modalWorkerSummaryVisible);

    return (
      <>
        <h4>Actividades</h4>
        <h5>Actividades Primarias</h5>
        <ul>
          {currentCodigoData.map(({ form, timestamp }) => <li><b>{new Date(timestamp).toLocaleString()}</b> {form.actividades.actividadPrimaria}</li>)}
        </ul>
        <h5>Actividades Secundarias</h5>
        <ul>
          {currentCodigoData.map(({ form, timestamp }) => <li><b>{new Date(timestamp).toLocaleString()}</b> {form.actividades.actividadSecundaria}</li>)}
        </ul>
        <h5>Actividades Faltantes</h5>
        <ul>
          {currentCodigoData.map(({ form, timestamp }) => <li><b>{new Date(timestamp).toLocaleString()}</b> {form.actividades.actividadFaltante}</li>)}
        </ul>

        <h4>Protección</h4>
        <BarChart
          width={450}
          height={200}
          data={[
            ...Object.keys(currentCodigoData[0]?.form?.proteccion || {}).map(item => ({
              name: `${item}`,
              value: currentCodigoData?.filter(
                ({ timestamp, form }) => form?.proteccion[item]
              ).length
            }))
          ]}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <YAxis dataKey="value" />
          <XAxis dataKey="name" />
          <Tooltip />
          <CartesianGrid stroke="#e4e4e4" />
          <Bar fill="#28b6ee" type="monotone" dataKey="value" yAxisId={0} />
        </BarChart>

        <h4>Capacitación</h4>
        <BarChart
          width={450}
          height={200}
          data={[
            ...Object.keys(currentCodigoData[0]?.form?.capacitacion || {}).map(item => ({
              name: `${item}`,
              value: currentCodigoData?.filter(
                ({ timestamp, form }) => form?.capacitacion[item]
              ).length
            }))
          ]}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <YAxis dataKey="value" />
          <XAxis dataKey="name" />
          <Tooltip />
          <CartesianGrid stroke="#e4e4e4" />
          <Bar fill="#ebbc3b" type="monotone" dataKey="value" yAxisId={0} />
        </BarChart>

        <h4>Bienestar</h4>
        <BarChart
          width={450}
          height={200}
          data={[
            ...Object.keys(currentCodigoData[0]?.form?.bienestar || {}).map(item => ({
              name: `${item}`,
              value: currentCodigoData?.filter(
                ({ timestamp, form }) => form?.bienestar[item]
              ).length
            }))
          ]}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <YAxis dataKey="value" />
          <XAxis dataKey="name" />
          <Tooltip />
          <CartesianGrid stroke="#e4e4e4" />
          <Bar fill="#93d161" type="monotone" dataKey="value" yAxisId={0} />
        </BarChart>
      </>
    )
  }

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <Modal
        title={`Datos del trabajador '${modalWorkerSummaryVisible}'`}
        centered
        motion={null}
        visible={modalWorkerSummaryVisible !== false}
        onOk={() => setModalWorkerSummaryVisible(false)}
        onCancel={() => setModalWorkerSummaryVisible(false)}
      >
        {renderInfoByCodigo()}
      </Modal>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 1000, margin: "auto", marginTop: 64 }}>
        <h2>Salud Ocupacional</h2>
        <Button onClick={handleRegisterOccupational}>Registrarse blockchain</Button>
        <Button onClick={handleShowRequests}>Mostrar Requests de workers</Button>
        <div>
          {requestsList && requestsList?.length > 0 && (requestsList[0].map((request, idx) => <div>{`${requestsList[1][idx]}_${requestsList[2][idx]}`} <Button onClick={() => handleWorkerAccessClick(request)}>Accept</Button></div>))}
        </div>

        <Divider />
        Dirección:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />

        <h3>Resumen por Tópico</h3>
        <p>Número de trabajadores por elementos de Protección, Capacitación y Bienestar. </p>
        <div style={{ display: "flex", gridGap: 10 }}>
          <div>
            <h3>Protección</h3>
            {/* Counts the number of formats using chaleco */}
            <BarChart
              width={480}
              height={200}
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
              <YAxis dataKey="value" />
              <XAxis dataKey="name" />
              <Tooltip />
              <CartesianGrid stroke="#e4e4e4" />
              <Bar fill="#28b6ee" type="monotone" dataKey="value" yAxisId={0} />
            </BarChart>
          </div>

          <br />
          <div>
            <h3>Capacitación</h3>
            <BarChart
              width={480}
              height={200}
              data={[
                ...Object.keys(data[0]?.form.capacitacion || {}).map(item => ({
                  name: `${item}`,
                  value: data?.filter(
                    ({ timestamp, form }) => form?.capacitacion[item]
                  ).length
                }))
              ]}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <YAxis dataKey="value" />
              <XAxis dataKey="name" />
              <Tooltip />
              <CartesianGrid stroke="#e4e4e4" />
              <Bar fill="#ebbc3b" type="monotone" dataKey="value" yAxisId={0} />
            </BarChart>
          </div>
        </div>

        <div style={{ display: "flex" }}>
          <div>
            <h3>Bienestar</h3>
            <BarChart
              width={480}
              height={200}
              data={[
                ...Object.keys(data[0]?.form.bienestar || {}).map(item => ({
                  name: `${item}`,
                  value: data?.filter(
                    ({ timestamp, form }) => form?.bienestar[item]
                  ).length
                }))
              ]}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <YAxis dataKey="value" />
              <XAxis dataKey="name" />
              <Tooltip />
              <CartesianGrid stroke="#e4e4e4" />
              <Bar fill="#93d161" type="monotone" dataKey="value" yAxisId={0} />
            </BarChart>
          </div>

          <div>
            <h4>Descanso</h4>
            <LineChart
              width={500}
              height={200}
              data={data.map(({ form, timestamp }, index) => ({
                timestamp: index,
                dormir: new Date(parseInt(form.descanso.dormirTimestamp)).getHours()*100 + new Date(parseInt(form.descanso.dormirTimestamp)).getMinutes(),
                despertar: new Date(parseInt(form.descanso.despertarTimestamp)).getHours()*100 + new Date(parseInt(form.descanso.despertarTimestamp)).getMinutes()
              }))
              }
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <YAxis />
              <XAxis dataKey="timestamp" />
              <Tooltip />
              <CartesianGrid stroke="#e4e4e4" />
              <Line stroke="#ee8828" type="monotone" dataKey="despertar" yAxisId={0} />
              <Line stroke="#4c28ee" type="monotone" dataKey="dormir" yAxisId={0} />
            </LineChart>
          </div>
        </div>

        <h3>Resumen por Trabajador</h3>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", width: "100%", gap: 10 }}>
          {data.filter((value, index, self) => {
            return (
              self.findIndex((v) => v.form.codigo === value.form.codigo) === index
            );
          }).map(({ form }) =>
            <Card
              style={{ width: 300, marginTop: 16 }}
              actions={[
                <EyeOutlined key="view" />,
              ]}
              onClick={() => setModalWorkerSummaryVisible(form.codigo)}
            >
              <Card.Meta
                avatar={<Avatar src={healthWorkerIcon} />}
                title={`Código ${form.codigo}`}
                description={`${form.nombre}`}
              />
            </Card>
          )
          }
        </div>
      </div>
    </div>
  );
}
