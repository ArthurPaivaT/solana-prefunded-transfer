const {
  AnchorProvider,
  web3,
  Program,
  BN,
  Wallet,
} = require("@project-serum/anchor");
const fs = require("fs");
const bs58 = require("bs58");
const { SystemProgram, clusterApiUrl } = require("@solana/web3.js");
const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
require("dotenv").config();

const idl = JSON.parse(fs.readFileSync("../target/idl/test_program.json"));

const programId = new web3.PublicKey(
  "AECpbyv5BG7f7Ez9A3ZfKtGQUwbaeGPJng4tNDpKcwuY"
);

const connection = new web3.Connection("http://localhost:8899", "confirmed");

const keypair = web3.Keypair.fromSecretKey(bs58.decode(process.env.WALLET));

const program = new Program(
  idl,
  programId,
  new AnchorProvider(connection, new Wallet(keypair))
);

const sender = keypair.publicKey;
const receiver = new web3.PublicKey(
  "Ciq7GUtYoFDBS2GDbGnJvipH5Hx8mLj1UntK97qJd6hG"
);

async function test() {
  console.log("testing");
  const mint = await Token.createMint(
    connection,
    keypair,
    keypair.publicKey,
    null,
    9,
    TOKEN_PROGRAM_ID
  );

  const senderToken = await mint.getOrCreateAssociatedAccountInfo(
    keypair.publicKey
  );
  const receiverToken = await mint.getOrCreateAssociatedAccountInfo(receiver);

  await mint.mintTo(
    senderToken.address,
    keypair.publicKey,
    [],
    1000000000000000
  );

  const nativeTransfer = await mint.transfer(
    senderToken.address,
    receiverToken.address,
    keypair,
    [],
    100000
  );

  console.log("nativeTransfer", nativeTransfer);

  const signature = await program.methods
    .splTransfer(new BN(1000))
    .accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      sender,
      senderAccount: senderToken.address,
      receiverAccount: receiverToken.address,
    })
    .rpc({ preflightCommitment: "confirmed" });
  console.log(signature);

  const signature2 = await program.methods
    .splTransfer(new BN(10000000))
    .accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      sender,
      senderAccount: senderToken.address,
      receiverAccount: receiverToken.address,
    })
    .rpc({ preflightCommitment: "confirmed" });
  console.log(signature2);

  //tx();
}

async function tx() {
  const signature = await program.methods
    .transfer(new BN(2000000))
    .accounts({
      sender,
      receiver,
      system_program: SystemProgram.programId,
    })
    .rpc({ preflightCommitment: "confirmed" });

  console.log(signature);
  return;
}

test();
