import {nft_initialize_impl,nft_mint_impl, nft_metadata_impl } from "openblimp";
import { NFTMetadata, NFTContractMetadata, Token } from "openblimp";
import { u128, context } from "near-sdk-as";

const base64TokenSvg:string="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZCQzM0RTt9Cgkuc3Qxe2ZpbGw6I0U1QTUzMzt9Cgkuc3Qye2ZpbGw6I0U0RURGMjt9Cjwvc3R5bGU+PGcgaWQ9IlRva2VuIj48Zz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYsMkM4LjI4LDIsMiw4LjI4LDIsMTZzNi4yOCwxNCwxNCwxNHMxNC02LjI4LDE0LTE0UzIzLjcyLDIsMTYsMnogTTE2LDI2Yy01LjUxNCwwLTEwLTQuNDg2LTEwLTEwICAgIFMxMC40ODYsNiwxNiw2czEwLDQuNDg2LDEwLDEwUzIxLjUxNCwyNiwxNiwyNnoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYsNkMxMC40ODYsNiw2LDEwLjQ4Niw2LDE2czQuNDg2LDEwLDEwLDEwczEwLTQuNDg2LDEwLTEwUzIxLjUxNCw2LDE2LDZ6IE0yMC4yNDQsMTcuMjcybC0xLjE1LDAuNjI2ICAgIGMtMC41MDQsMC4yNzUtMC45MTcsMC42ODctMS4xOTMsMS4xOWwtMC42MzEsMS4xNDZjLTAuMjU1LDAuNDY0LTAuNzQxLDAuNzUxLTEuMjcsMC43NTFzLTEuMDE1LTAuMjg4LTEuMjctMC43NTFsLTAuNjMtMS4xNDcgICAgYy0wLjI3Ny0wLjUwNC0wLjY5LTAuOTE2LTEuMTk1LTEuMTkxbC0xLjE0OC0wLjYyNUMxMS4yODksMTcuMDE5LDExLDE2LjUzMSwxMSwxNnMwLjI4OS0xLjAxOSwwLjc1Ni0xLjI3MmwxLjE1LTAuNjI2ICAgIGMwLjUwNC0wLjI3NSwwLjkxNy0wLjY4NywxLjE5My0xLjE5bDAuNjMxLTEuMTQ2YzAuMjU1LTAuNDY0LDAuNzQxLTAuNzUxLDEuMjctMC43NTFzMS4wMTUsMC4yODgsMS4yNywwLjc1MWwwLjYzLDEuMTQ3ICAgIGMwLjI3NywwLjUwMywwLjY5LDAuOTE1LDEuMTk0LDEuMTlsMS4xNDksMC42MjVDMjAuNzExLDE0Ljk4MSwyMSwxNS40NjksMjEsMTZTMjAuNzExLDE3LjAxOSwyMC4yNDQsMTcuMjcyeiIvPjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yMC4yNDMsMTQuNzI3bC0xLjE0OS0wLjYyNWMtMC41MDQtMC4yNzUtMC45MTctMC42ODctMS4xOTQtMS4xOWwtMC42My0xLjE0NyAgICBjLTAuMjU1LTAuNDYzLTAuNzQxLTAuNzUxLTEuMjctMC43NTFzLTEuMDE1LDAuMjg4LTEuMjcsMC43NTFsLTAuNjMsMS4xNDZjLTAuMjc2LDAuNTA0LTAuNjg5LDAuOTE2LTEuMTkzLDEuMTlsLTEuMTUsMC42MjYgICAgQzExLjI4OSwxNC45ODEsMTEsMTUuNDY5LDExLDE2czAuMjg5LDEuMDE5LDAuNzU3LDEuMjczbDEuMTQ4LDAuNjI1YzAuNTA1LDAuMjc1LDAuOTE4LDAuNjg3LDEuMTk1LDEuMTkxbDAuNjMsMS4xNDcgICAgYzAuMjU1LDAuNDYzLDAuNzQxLDAuNzUxLDEuMjcsMC43NTFjMC41MjksMCwxLjAxNS0wLjI4OCwxLjI3LTAuNzUxbDAuNjMxLTEuMTQ2YzAuMjc2LTAuNTA0LDAuNjg5LTAuOTE2LDEuMTkzLTEuMTlsMS4xNS0wLjYyNiAgICBDMjAuNzExLDE3LjAxOSwyMSwxNi41MzEsMjEsMTZTMjAuNzExLDE0Ljk4MSwyMC4yNDMsMTQuNzI3eiIvPjwvZz48L2c+PC9zdmc+"

export function nft_transfer(
    receiver_id: string,
    token_id: string,
    approval_id: number,
    memo: string): void {
    return
}

export function ft_transfer_call(
    receiver_id: string,
    token_id: string,
    approval_id: number,
    memo: string,
    msg: string): void {
    return;
}

function nft_resolve_transfer(
    owner_id: string,
    receiver_id: string,
    token_id: string,
    approved_account_ids: Map<string, number>|null,
  ): boolean {
      return false
  }

// Returns the token with the given `token_id` or `null` if no such token.
export function nft_token(token_id: string): Token|null {
    return null
}
/*
export function ft_total_supply(): string {
    return ft_total_supply_impl().toString();
}

export function ft_balance_of(account_id: string): string {
    return ft_balance_of_impl(account_id).toString();
}
 */
export function nft_initialize():void{
    nft_initialize_impl("nft-name", "nft-symbl", base64TokenSvg, "", "", "");
}

export function nft_mint( token_id: string, metadata: NFTMetadata, receiver_id: string):void{
    nft_mint_impl( token_id, metadata, receiver_id);
}

/* export function ft_burn(account: string, amount: string):void{
    ft_burn_impl(account, u128.from(amount))
}
 */
export function nft_metadata():NFTContractMetadata{
    return nft_metadata_impl();
}
/*
export function storage_deposit(account_id: string = context.predecessor, registration_only: boolean = false):FungibleTokenStorageBalance{
    return storage_deposit_impl(account_id, registration_only)
}

export function storage_withdraw(amount: string | null):FungibleTokenStorageBalance{
    return storage_withdraw_impl(amount)
}

export function storage_unregister(force: boolean):boolean {
    return storage_unregister_impl(false);
}

export function storage_balance_bounds():FungibleTokenStorageBalanceBounds{
    return storage_balance_bounds_impl()
}

export function storage_balance_of(account_id: string):FungibleTokenStorageBalance{
    return storage_balance_of_impl(account_id)
} */