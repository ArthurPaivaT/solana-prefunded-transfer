use anchor_lang::prelude::*;
use solana_program::{
    account_info::AccountInfo, msg, program::invoke, pubkey::Pubkey, system_instruction,
};

declare_id!("AECpbyv5BG7f7Ez9A3ZfKtGQUwbaeGPJng4tNDpKcwuY");

#[program]
pub mod test_program {

    use super::*;

    pub fn transfer(ctx: Context<SolTransfer>, amount: u64) -> Result<()> {
        let system_program = &mut ctx.accounts.system_program;
        let sender = &mut ctx.accounts.sender.to_account_info();
        let receiver = &mut ctx.accounts.receiver;

        let balance = receiver.lamports();

        if (amount + 500) > balance {
            msg!("Invalid bet {:?} {:?}", amount + 500, balance);
            return Err(error!(ErrorCode::Unauthorized));
        }

        msg!(
            "Sending {:?} from {:?} to {:?}",
            amount,
            sender.key,
            receiver.key
        );

        invoke(
            &system_instruction::transfer(sender.key, receiver.key, amount),
            &[
                sender.clone(),
                receiver.clone(),
                system_program.to_account_info(),
            ],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolTransfer<'info> {
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub sender: Signer<'info>,
    /// CHECK: This is not dangerous but I don't know why
    #[account(mut)]
    pub receiver: AccountInfo<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Receiver not authorized.")]
    Unauthorized,
}
