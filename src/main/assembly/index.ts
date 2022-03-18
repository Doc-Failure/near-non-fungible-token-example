import {ft_transfer_call_impl, ft_initialize_impl, FungibleTokenMetadata, ft_metadata_impl, ft_transfer_impl, ft_total_supply_impl, ft_balance_of_impl, ft_mint_impl, ft_burn_impl} from "openblimp";
import { storage_deposit_impl, storage_withdraw_impl, storage_unregister_impl, storage_balance_bounds_impl, storage_balance_of_impl } from "openblimp";
import { FungibleTokenStorageBalance, FungibleTokenStorageBalanceBounds} from "openblimp";
import { u128, context } from "near-sdk-as";

const base64TokenSvg:string="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZCQzM0RTt9Cgkuc3Qxe2ZpbGw6I0U1QTUzMzt9Cgkuc3Qye2ZpbGw6I0U0RURGMjt9Cjwvc3R5bGU+PGcgaWQ9IlRva2VuIj48Zz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYsMkM4LjI4LDIsMiw4LjI4LDIsMTZzNi4yOCwxNCwxNCwxNHMxNC02LjI4LDE0LTE0UzIzLjcyLDIsMTYsMnogTTE2LDI2Yy01LjUxNCwwLTEwLTQuNDg2LTEwLTEwICAgIFMxMC40ODYsNiwxNiw2czEwLDQuNDg2LDEwLDEwUzIxLjUxNCwyNiwxNiwyNnoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYsNkMxMC40ODYsNiw2LDEwLjQ4Niw2LDE2czQuNDg2LDEwLDEwLDEwczEwLTQuNDg2LDEwLTEwUzIxLjUxNCw2LDE2LDZ6IE0yMC4yNDQsMTcuMjcybC0xLjE1LDAuNjI2ICAgIGMtMC41MDQsMC4yNzUtMC45MTcsMC42ODctMS4xOTMsMS4xOWwtMC42MzEsMS4xNDZjLTAuMjU1LDAuNDY0LTAuNzQxLDAuNzUxLTEuMjcsMC43NTFzLTEuMDE1LTAuMjg4LTEuMjctMC43NTFsLTAuNjMtMS4xNDcgICAgYy0wLjI3Ny0wLjUwNC0wLjY5LTAuOTE2LTEuMTk1LTEuMTkxbC0xLjE0OC0wLjYyNUMxMS4yODksMTcuMDE5LDExLDE2LjUzMSwxMSwxNnMwLjI4OS0xLjAxOSwwLjc1Ni0xLjI3MmwxLjE1LTAuNjI2ICAgIGMwLjUwNC0wLjI3NSwwLjkxNy0wLjY4NywxLjE5My0xLjE5bDAuNjMxLTEuMTQ2YzAuMjU1LTAuNDY0LDAuNzQxLTAuNzUxLDEuMjctMC43NTFzMS4wMTUsMC4yODgsMS4yNywwLjc1MWwwLjYzLDEuMTQ3ICAgIGMwLjI3NywwLjUwMywwLjY5LDAuOTE1LDEuMTk0LDEuMTlsMS4xNDksMC42MjVDMjAuNzExLDE0Ljk4MSwyMSwxNS40NjksMjEsMTZTMjAuNzExLDE3LjAxOSwyMC4yNDQsMTcuMjcyeiIvPjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yMC4yNDMsMTQuNzI3bC0xLjE0OS0wLjYyNWMtMC41MDQtMC4yNzUtMC45MTctMC42ODctMS4xOTQtMS4xOWwtMC42My0xLjE0NyAgICBjLTAuMjU1LTAuNDYzLTAuNzQxLTAuNzUxLTEuMjctMC43NTFzLTEuMDE1LDAuMjg4LTEuMjcsMC43NTFsLTAuNjMsMS4xNDZjLTAuMjc2LDAuNTA0LTAuNjg5LDAuOTE2LTEuMTkzLDEuMTlsLTEuMTUsMC42MjYgICAgQzExLjI4OSwxNC45ODEsMTEsMTUuNDY5LDExLDE2czAuMjg5LDEuMDE5LDAuNzU3LDEuMjczbDEuMTQ4LDAuNjI1YzAuNTA1LDAuMjc1LDAuOTE4LDAuNjg3LDEuMTk1LDEuMTkxbDAuNjMsMS4xNDcgICAgYzAuMjU1LDAuNDYzLDAuNzQxLDAuNzUxLDEuMjcsMC43NTFjMC41MjksMCwxLjAxNS0wLjI4OCwxLjI3LTAuNzUxbDAuNjMxLTEuMTQ2YzAuMjc2LTAuNTA0LDAuNjg5LTAuOTE2LDEuMTkzLTEuMTlsMS4xNS0wLjYyNiAgICBDMjAuNzExLDE3LjAxOSwyMSwxNi41MzEsMjEsMTZTMjAuNzExLDE0Ljk4MSwyMC4yNDMsMTQuNzI3eiIvPjwvZz48L2c+PC9zdmc+"

export function ft_transfer(receiver_id: string, amount: string, memo: string=""): void {
    ft_transfer_impl(receiver_id, u128.from(amount), "a");
}

export function ft_transfer_call(receiver_id: string, amount: string, msg: string, memo: string=""): void {
    ft_transfer_call_impl(receiver_id, u128.from(amount), msg, "a");
}

export function ft_total_supply(): string {
    return ft_total_supply_impl().toString();
}

export function ft_balance_of(account_id: string): string {
    return ft_balance_of_impl(account_id).toString();
}

export function ft_initialize():void{
    ft_initialize_impl("TokenName", "SYMB", 0, base64TokenSvg, "", "");
}

export function ft_mint(account: string, amount: string):void{
    ft_mint_impl(account, u128.from(amount))
}

export function ft_burn(account: string, amount: string):void{
    ft_burn_impl(account, u128.from(amount))
}

export function ft_metadata():FungibleTokenMetadata{
    return ft_metadata_impl();
}

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
}