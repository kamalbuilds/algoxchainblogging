#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("4p1tduyH9SQLzmHgGHTxmeDa5QX1zdUEask4PbhYFerY");

#[program]
pub mod solscribe {
    use super::*;

  pub fn close(_ctx: Context<CloseSolscribe>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solscribe.count = ctx.accounts.solscribe.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solscribe.count = ctx.accounts.solscribe.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolscribe>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.solscribe.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSolscribe<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Solscribe::INIT_SPACE,
  payer = payer
  )]
  pub solscribe: Account<'info, Solscribe>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSolscribe<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub solscribe: Account<'info, Solscribe>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub solscribe: Account<'info, Solscribe>,
}

#[account]
#[derive(InitSpace)]
pub struct Solscribe {
  count: u8,
}
