const fs = require('fs');
const readline = require('readline');
var colors = require('colors/safe');
const os = require('os');
const si = require('systeminformation');
const path = require('path');
const { exec } = require('child_process');

function getUsername() {
    return (
        process.env.SUDO_USER ||
        process.env.C9_USER ||
        process.env.LOGNAME ||
        process.env.USER ||
        process.env.LNAME ||
        process.env.USERNAME
    );
}
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tempFolderPath = path.join(os.tmpdir(), '*');


async function FetchHardWareData(){

    si.get({
        cpu: 'manufacturer, brand, speed, cores, physicalCores',
        memory: 'total, free',
        osInfo: 'platform, distro, release, arch',
        battery: 'hasBattery, isCharging, percent',
        graphics: 'controllers'
      }).then(data => {
        // Display CPU information
        console.log(colors.yellow('CPU Information:'));
        console.log(`Manufacturer: ${data.cpu.manufacturer}`);
        console.log(`Brand: ${data.cpu.brand}`);
        console.log(`Speed: ${data.cpu.speed} GHz`);
        console.log(`Cores: ${data.cpu.cores}`);
        console.log(`Physical Cores: ${data.cpu.physicalCores}`);
        console.log();
      
        // Display memory information
        console.log(colors.yellow('Memory Information:'));
        console.log(`Total Memory: ${os.totalmem} MB`);
        console.log(`Free Memory: ${os.freemem} MB`);
        console.log();
      
        // Display operating system information
        console.log(colors.yellow('OS Information:'));
        console.log(`Platform: ${os.platform}`);
        console.log(`Release: ${os.release()}`);
        console.log();
      
        // Display graphics controllers information
        console.log(colors.yellow('Graphics Controllers:'));
        data.graphics.controllers.forEach((controller, index) => {
          console.log(`Controller ${index + 1}: ${controller.model}`);
        });
      }).catch(error => {
        console.error('Error retrieving hardware information:', error);
      });      
}

function DeleteTempFiles(){
    fs.rm(tempFolderPath, { recursive: true }, (err) => {
    if (err) {
        console.error(colors.red(`Error deleting files: ${err.message}`));
    } else {
        console.log(colors.green('Files deleted successfully'));
    }
    });
    console.log(colors.green("[!]" + " Deleted files succesfully"))
}

function EnableSecInClock() {
   // Define the registry key path and value to set
  const registryKeyPath = 'HKCU\\Control Panel\\International';
  const registryValueName = 'sTimeFormat';
  const registryNewValue = 'h:mm:ss tt'; 

  // Construct the command to set the registry value using reg.exe
  const command = `reg add "${registryKeyPath}" /v "${registryValueName}" /t REG_SZ /d "${registryNewValue}" /f`;

  // Execute the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error setting registry value: ${error.message}`);
      return;
    }
    console.log('Seconds enabled in the Windows clock.');
  });
  }

var Choices = {
    1: "1. Temporarily files",
    2: "2. Show system hardware",
    3: "3. Enable seconds in clockn"
}
const promptMessage = 'Enter option:\n' + Object.values(Choices).join('\n') + "\n\n";

console.log(colors.cyan(`Welcome ${getUsername()} to UTool V1`))
console.log(colors.blue(`[!] This is still in beta, expect bugs`))
rl.question(promptMessage, (answer) => {
    console.log(`You chose: ${answer}`);

    switch (answer) {
      case "1":
        console.clear()
        DeleteTempFiles();
        break;
      case "2":
        console.clear()
        console.log(colors.green("[!]" + " Fetching system information\n"))
        FetchHardWareData()
      break;
      case "3":
        console.clear()
        console.log(colors.green("[!]" + " Enabling seconds in clock\n"))
        EnableSecInClock()
      break;

      default:
        console.log('Invalid choice');
        break;
    }
  
    rl.close();
  });

// Event listener for when the interface is closed
rl.on('close', () => {
  //console.log('Input interface closed');
});
