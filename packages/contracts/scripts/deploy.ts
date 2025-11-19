import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ZKSign contracts...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy CredentialRegistry
  console.log("\n1. Deploying CredentialRegistry...");
  const CredentialRegistry = await ethers.getContractFactory("CredentialRegistry");
  const registry = await CredentialRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("CredentialRegistry deployed to:", registryAddress);

  // Deploy CollegeIDVerifier
  console.log("\n2. Deploying CollegeIDVerifier...");
  const CollegeIDVerifier = await ethers.getContractFactory("CollegeIDVerifier");
  const collegeIDVerifier = await CollegeIDVerifier.deploy(registryAddress);
  await collegeIDVerifier.waitForDeployment();
  const collegeIDAddress = await collegeIDVerifier.getAddress();
  console.log("CollegeIDVerifier deployed to:", collegeIDAddress);

  // Deploy CitizenshipCardVerifier
  console.log("\n3. Deploying CitizenshipCardVerifier...");
  const CitizenshipCardVerifier = await ethers.getContractFactory("CitizenshipCardVerifier");
  const citizenshipVerifier = await CitizenshipCardVerifier.deploy(registryAddress);
  await citizenshipVerifier.waitForDeployment();
  const citizenshipAddress = await citizenshipVerifier.getAddress();
  console.log("CitizenshipCardVerifier deployed to:", citizenshipAddress);

  // Deploy DriversLicenseVerifier
  console.log("\n4. Deploying DriversLicenseVerifier...");
  const DriversLicenseVerifier = await ethers.getContractFactory("DriversLicenseVerifier");
  const driversLicenseVerifier = await DriversLicenseVerifier.deploy(registryAddress);
  await driversLicenseVerifier.waitForDeployment();
  const driversLicenseAddress = await driversLicenseVerifier.getAddress();
  console.log("DriversLicenseVerifier deployed to:", driversLicenseAddress);

  // Deploy VehicleRegistrationVerifier
  console.log("\n5. Deploying VehicleRegistrationVerifier...");
  const VehicleRegistrationVerifier = await ethers.getContractFactory("VehicleRegistrationVerifier");
  const vehicleRegVerifier = await VehicleRegistrationVerifier.deploy(registryAddress);
  await vehicleRegVerifier.waitForDeployment();
  const vehicleRegAddress = await vehicleRegVerifier.getAddress();
  console.log("VehicleRegistrationVerifier deployed to:", vehicleRegAddress);

  // Authorize deployer as issuer for testing
  console.log("\n6. Authorizing deployer as issuer...");
  const tx = await registry.authorizeIssuer(deployer.address);
  await tx.wait();
  console.log("Deployer authorized as issuer");

  // Print summary
  console.log("\n=== Deployment Summary ===");
  console.log("CredentialRegistry:", registryAddress);
  console.log("CollegeIDVerifier:", collegeIDAddress);
  console.log("CitizenshipCardVerifier:", citizenshipAddress);
  console.log("DriversLicenseVerifier:", driversLicenseAddress);
  console.log("VehicleRegistrationVerifier:", vehicleRegAddress);

  // Save addresses to file
  const fs = require("fs");
  const addresses = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    registry: registryAddress,
    verifiers: {
      collegeID: collegeIDAddress,
      citizenshipCard: citizenshipAddress,
      driversLicense: driversLicenseAddress,
      vehicleRegistration: vehicleRegAddress,
    },
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\nAddresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

