const {
  AnchorProvider,
  web3,
  Program,
  BN,
  Wallet,
} = require("@project-serum/anchor");
const fs = require("fs");
const bs58 = require("bs58");
const { SystemProgram } = require("@solana/web3.js");
require("dotenv").config();

const idl = JSON.parse(fs.readFileSync("../target/idl/test_program.json"));

const programId = new web3.PublicKey(
  "AECpbyv5BG7f7Ez9A3ZfKtGQUwbaeGPJng4tNDpKcwuY"
);

const connection = new web3.Connection("http://localhost:8899", "confirmed");

console.log(process.env);

const keypair = web3.Keypair.fromSecretKey(bs58.decode(process.env.WALLET));

const program = new Program(
  idl,
  programId,
  new AnchorProvider(connection, new Wallet(keypair))
);

const sender = keypair.publicKey;
const receiver = new web3.PublicKey(
  "G34GvbBrz3X2ax2qsQKKWKWE2CkSnorDmbKuTkxfbRQ5"
);

async function tx() {
  const signature = await program.methods
    .transfer(new BN(200000000000))
    .accounts({
      sender,
      receiver,
      system_program: SystemProgram.programId,
      system_program: SystemProgram.programId,
    })
    .rpc({ preflightCommitment: "confirmed" });

  console.log(signature);
}

tx();
