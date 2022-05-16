// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 < 0.9.0;
pragma experimental ABIEncoderV2;

contract HealthOcupational {
    
    // Direccion del profesional en salud ocupacional -> Owner / Dueño del contrato 
    address public HealthOcupationalDirection;
    
    // Constructor del contrato 
    // constructor () public {
    //     HealthOcupationalDirection = msg.sender;
    // }
    
    function OHDirection () public {
        HealthOcupationalDirection = msg.sender;
        emit NewOHDirection (HealthOcupationalDirection);
    }

    // Mapping para relacionar los empleados (direccion/address) con la validez del sistema de gestion
    mapping (address => bool) public WorkerValidation;
    
    // Relacionar una direccion de un empleado con su contrato 
    mapping (address => address) public ContractWorker;
    
    // Array de direcciones que almacene los contratos de los empleados validados 
    address [] public WorkersContractDirections;
    
    // Array de las direcciones que soliciten acceso 
    address [] public requests;
    
    // Eventos a emitir 
    event AccessRequests (address);
    event NewWorkerValidated (address);
    event NewSContract (address, address);
    event NewOHDirection (address);
    event RevRequest (address[]);
    
    
    // Modificador que permita unicamente la ejecucion de funciones por el profesional de salud ocupacional 
    modifier OnlyHO(address _direction) {
        require(_direction == HealthOcupationalDirection, "No tienes permisos para realizar esta funcion.");
        _;
    }
    
    // Funcion para solicitar acceso al sistema
    function RequestAccess() public {
        // Almacenar la direccion en el array de solicitudes 
        requests.push(msg.sender);
        // Emision del evento 
        emit AccessRequests (msg.sender);
    }
    
    // Funcion que visualiza las direcciones que han solicitado este acceso 
    function ShowRequests() public view OnlyHO(msg.sender) returns (address [] memory){
        //emit RevRequest (requests);
        return requests;
    }
    
    // Funcion para validar nuevos centros de salud que puedan autogestionarse -> Unicamente prof. en S. O.
    function WorkerAccess (address _empleado) public OnlyHO(msg.sender) {
        // Asignacion del estado de validez del empleado 
        WorkerValidation[_empleado] = true;
        // Emision del evento 
        emit NewWorkerValidated(_empleado);
    }
    
    
    // Funcion que permita crear un contrato inteligente de un empleado 
    function NewWorkerSC() public {
        // Filtrado para que unicamente los centros de salud validados sean capaces de ejecutar esta funcion 
        require (WorkerValidation[msg.sender] == true, "No tienes permisos para ejecutar esta funcion.");
        // Generar un Smart Contract -> Generar su direccion 
        address contrato_Empleado = address (new WorkerSC(msg.sender));
        // Almacenamiento la direccion del contrato en el array 
        WorkersContractDirections.push(contrato_Empleado);
        // Relacion entre el centro de salud y su contrato 
        ContractWorker[msg.sender] = contrato_Empleado;
        // Emisio del evento 
        emit NewSContract(contrato_Empleado, msg.sender);
    }
    
}


// Contrato autogestionable por el Centro de Salud 
contract WorkerSC {
    
    // Direcciones iniciales 
    address public WorkerDirection;
    address public SCDirection;
    
    constructor (address _direction) public {
        WorkerDirection = _direction;
        SCDirection = address(this);
    }
    
    // Mapping para relacionar el hash de la persona con los resultados (diagnostico, CODIGO IPFS)
    mapping (address => ResultadosIN) INResult;
    mapping (address => ResultadosOUT) OUTResult;

    // Estructura de los resultados de entrada al trabajo
    struct ResultadosIN {
        string PrimaryActivity;
        string SecundaryActivity;
        string MissingActivity;
        bool Protection;
        bool Capacitation;
        bool FMWelfare;
        bool PsySub;
        bool CorporalPain;
        bool Sleep;
    }
    // Estructura de los resultados de entrada al trabajo
    struct ResultadosOUT {
        bool HeadPain;
        bool MusclePain;
        bool EyePain;
        bool HearPain;
        bool Laceration;
        bool Fracture;
        bool Entrapments;
        bool RepMov;
    }

    // Eventos
    event NewRequestIN (string, string, string, bool, bool, bool, bool, bool, bool);
    event NewRequestOUT (bool, bool, bool, bool, bool, bool, bool, bool);

    // Filtrar las funciones a ejecutar por el centro de salud 
    modifier OnlyWorker(address _direction) {
        require (_direction == WorkerDirection, "No tienes permisos para ejecutar esta funcion.");
        _;
    }
    // Funcion para emitir resultados de entrada al tarabajo
    function DataINWorker(string memory newPrimaryActivity, string memory newSecundaryActivity, string memory newMissingActivity, bool newProtection, bool newCapacitation, bool newFMWelfare, bool newPsySub, bool newCorporalPain, bool newSleep) public OnlyWorker(msg.sender){
        // Relacion del hash de la persona con la estructura de resultados 
        INResult[WorkerDirection] = ResultadosIN(newPrimaryActivity, newSecundaryActivity, newMissingActivity, newProtection, newCapacitation, newFMWelfare, newPsySub, newCorporalPain, newSleep);
        // Emision de un evento 
        emit NewRequestIN(newPrimaryActivity, newSecundaryActivity, newMissingActivity, newProtection, newCapacitation, newFMWelfare, newPsySub, newCorporalPain, newSleep);
    }

    // Funcion para emitir resultados de salida del trabajo
    function DataOUTWorker(bool newHeadPain, bool newMusclePain, bool newEyePain, bool newHearPain, bool newLaceration, bool newFracture, bool newEntrapments, bool newRepMov) public OnlyWorker(msg.sender){
        // Relacion del hash de la persona con la estructura de resultados 
        OUTResult[WorkerDirection] = ResultadosOUT(newHeadPain, newMusclePain, newEyePain, newHearPain, newLaceration, newFracture, newEntrapments, newRepMov);
        // Emision de un evento 
        emit NewRequestOUT(newHeadPain, newMusclePain, newEyePain, newHearPain, newLaceration, newFracture, newEntrapments, newRepMov);
    }

    // Funcion para visulizar los datos de entrada al trabajo en el SC
    function ViewINWorker(address _idPersona) public view returns (string memory _PrimaryActivity, string memory _SecundaryActivity, string memory _MissingActivity, bool _Protection, bool _Capacitation, bool _FMWelfare, bool _PsySub, bool _CorporalPain, bool _Sleep) {
        // Retorno de los parametros necesarios
        _PrimaryActivity = INResult[_idPersona].PrimaryActivity;
        _SecundaryActivity = INResult[_idPersona].SecundaryActivity;
        _MissingActivity = INResult[_idPersona].MissingActivity;
        _Protection = INResult[_idPersona].Protection;
        _Capacitation = INResult[_idPersona].Capacitation;
        _FMWelfare = INResult[_idPersona].FMWelfare;
        _PsySub = INResult[_idPersona].PsySub;
        _CorporalPain = INResult[_idPersona].CorporalPain;
        _Sleep = INResult[_idPersona].Sleep;
    }
    // Funcion para visulizar los datos de salida del trabajo en el SC
    function ViewOUTWorker(address _idPersona) public view returns (bool _HeadPain, bool _MusclePain, bool _EyePain, bool _HearPain, bool _Laceration, bool _Fracture, bool _Entrapments, bool _RepMov) {
        // Retorno de los parametros necesarios
        _HeadPain = OUTResult[_idPersona].HeadPain;
        _MusclePain = OUTResult[_idPersona].MusclePain;
        _EyePain = OUTResult[_idPersona].EyePain;
        _HearPain = OUTResult[_idPersona].HearPain;
        _Laceration = OUTResult[_idPersona].Laceration;
        _Fracture = OUTResult[_idPersona].Fracture;
        _Entrapments = OUTResult[_idPersona].Entrapments;
        _RepMov = OUTResult[_idPersona].RepMov;
        }
}
