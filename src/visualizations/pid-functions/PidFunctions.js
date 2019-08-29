//var integralErr = 0;
//var pidParams = [30, 20, 5];

var GetPoints = function() {
  // private counter
  var counter = 0;
  // initialize setpoint array
  var setpointArr = new Array(500);
  for (var i = 0; i < 100; i++) {
    setpointArr[i] = 0;
    setpointArr[i + 100] = 0.4;
    setpointArr[i + 200] = 0.2;
    setpointArr[i + 300] = 0.1;
    setpointArr[i + 400] = 0.4;
  }
  for (var i = 0; i < 50; i++) {
    setpointArr[i + 150] = 0;
    setpointArr[i + 350] = 0.65;
  }
  const pvArr = [];

  for (var i = 0; i < 100; i++) {
    pvArr.push(0);
  }
  //PID old args processVar, prevProcessVar, pidParams, setpoint

  function ShiftSetpoint() {
    var shiftPoint = setpointArr.shift();
    setpointArr.push(shiftPoint);
  }

  var integralErr = 0;

  function PID(processVar, prevProcessVar, pidParams) {
    // add setpoint arg
    //, coeff) {
    var Kc = (pidParams[0] / 100) * 40 + 25; // controller gain
    var tauI = (pidParams[1] / 100) * 30 + 15; // integral time constant
    var tauD = (pidParams[2] / 100) * 18 + 2; // derivative time constant

    var KP = Kc; // proportional gain
    var KI = Kc / tauI; // integral gain
    var KD = Kc * tauD; // derivative gain

    var deltaT = 0.1;

    var sp = setpointArr[99];

    var error = sp - processVar;
    integralErr = integralErr + KI * error * deltaT;
    var dPV = processVar - prevProcessVar;

    var P = KP * error;
    var I = integralErr;
    var D = -KD * dPV;

    var output = P + I + D;
    return output;
  }

  //initialize values used in the GetPV func
  var dxdt = 0;
  var x = 0;
  var lastX = 0;
  var v = 0;
  var controlVar = 0;

  function GetPV(pidParams) {
    var g = 4;
    x = x + dxdt;
    controlVar = PID(x, lastX, pidParams);
    var yComponent = Math.sin((Math.PI / 180) * controlVar);
    var deltaT = 0.1;
    v = v + g * yComponent * deltaT;
    dxdt = v * deltaT + 0.5 * g * yComponent * Math.pow(deltaT, 2);
    lastX = x;
    pvArr.shift();
    pvArr.push(x);
    return pvArr;
  }

  return {
    GetPoints: function(pidParams) {
      ShiftSetpoint(); 
      var pv = GetPV(pidParams);
      
      var visibleSpArr = setpointArr.slice(0, 200);
      return [visibleSpArr, pv];
    },
    GetSpArr: function() {
      return setpointArr;
    }
  };
};

export { GetPoints };
