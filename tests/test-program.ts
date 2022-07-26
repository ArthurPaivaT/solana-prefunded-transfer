import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { PublicKey } from "@solana/web3.js";
import { TestProgram } from "../target/types/test_program";

describe("test-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TestProgram as Program<TestProgram>;

  const receiver = new PublicKey(
    "G34GvbBrz3X2ax2qsQKKWKWE2CkSnorDmbKuTkxfbRQ5"
  );

  const sender = anchor.getProvider().wallet.payer.publicKey;

  it("Is initialized!", async () => {
    console.log(await anchor.getProvider().connection.getBalance(sender));
    console.log(await anchor.getProvider().connection.getBalance(receiver));
    // Add your test here.
    const tx = await program.methods
      .transfer(new anchor.BN(9000000000000))
      .accounts({
        sender,
        receiver,
      })
      .rpc();
    console.log(await anchor.getProvider().connection.getBalance(sender));
    console.log(await anchor.getProvider().connection.getBalance(receiver));
  });
});
