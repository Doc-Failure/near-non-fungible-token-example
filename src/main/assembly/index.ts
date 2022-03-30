import {nft_initialize_impl,nft_mint_impl, nft_metadata_impl, nft_tokens_for_owner_impl, nft_total_supply_impl, nft_supply_for_owner_impl } from "openblimp";
import { NFTtokenMetadata, NFTContractMetadata, Token } from "openblimp";
import { u128, context, PersistentSet, PersistentVector } from "near-sdk-as";
/* import { TokenId } from "openblimp/assembly/contracts/utils/utils"; */

const base64TokenSvg:string="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZCQzM0RTt9Cgkuc3Qxe2ZpbGw6I0U1QTUzMzt9Cgkuc3Qye2ZpbGw6I0U0RURGMjt9Cjwvc3R5bGU+PGcgaWQ9IlRva2VuIj48Zz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYsMkM4LjI4LDIsMiw4LjI4LDIsMTZzNi4yOCwxNCwxNCwxNHMxNC02LjI4LDE0LTE0UzIzLjcyLDIsMTYsMnogTTE2LDI2Yy01LjUxNCwwLTEwLTQuNDg2LTEwLTEwICAgIFMxMC40ODYsNiwxNiw2czEwLDQuNDg2LDEwLDEwUzIxLjUxNCwyNiwxNiwyNnoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYsNkMxMC40ODYsNiw2LDEwLjQ4Niw2LDE2czQuNDg2LDEwLDEwLDEwczEwLTQuNDg2LDEwLTEwUzIxLjUxNCw2LDE2LDZ6IE0yMC4yNDQsMTcuMjcybC0xLjE1LDAuNjI2ICAgIGMtMC41MDQsMC4yNzUtMC45MTcsMC42ODctMS4xOTMsMS4xOWwtMC42MzEsMS4xNDZjLTAuMjU1LDAuNDY0LTAuNzQxLDAuNzUxLTEuMjcsMC43NTFzLTEuMDE1LTAuMjg4LTEuMjctMC43NTFsLTAuNjMtMS4xNDcgICAgYy0wLjI3Ny0wLjUwNC0wLjY5LTAuOTE2LTEuMTk1LTEuMTkxbC0xLjE0OC0wLjYyNUMxMS4yODksMTcuMDE5LDExLDE2LjUzMSwxMSwxNnMwLjI4OS0xLjAxOSwwLjc1Ni0xLjI3MmwxLjE1LTAuNjI2ICAgIGMwLjUwNC0wLjI3NSwwLjkxNy0wLjY4NywxLjE5My0xLjE5bDAuNjMxLTEuMTQ2YzAuMjU1LTAuNDY0LDAuNzQxLTAuNzUxLDEuMjctMC43NTFzMS4wMTUsMC4yODgsMS4yNywwLjc1MWwwLjYzLDEuMTQ3ICAgIGMwLjI3NywwLjUwMywwLjY5LDAuOTE1LDEuMTk0LDEuMTlsMS4xNDksMC42MjVDMjAuNzExLDE0Ljk4MSwyMSwxNS40NjksMjEsMTZTMjAuNzExLDE3LjAxOSwyMC4yNDQsMTcuMjcyeiIvPjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yMC4yNDMsMTQuNzI3bC0xLjE0OS0wLjYyNWMtMC41MDQtMC4yNzUtMC45MTctMC42ODctMS4xOTQtMS4xOWwtMC42My0xLjE0NyAgICBjLTAuMjU1LTAuNDYzLTAuNzQxLTAuNzUxLTEuMjctMC43NTFzLTEuMDE1LDAuMjg4LTEuMjcsMC43NTFsLTAuNjMsMS4xNDZjLTAuMjc2LDAuNTA0LTAuNjg5LDAuOTE2LTEuMTkzLDEuMTlsLTEuMTUsMC42MjYgICAgQzExLjI4OSwxNC45ODEsMTEsMTUuNDY5LDExLDE2czAuMjg5LDEuMDE5LDAuNzU3LDEuMjczbDEuMTQ4LDAuNjI1YzAuNTA1LDAuMjc1LDAuOTE4LDAuNjg3LDEuMTk1LDEuMTkxbDAuNjMsMS4xNDcgICAgYzAuMjU1LDAuNDYzLDAuNzQxLDAuNzUxLDEuMjcsMC43NTFjMC41MjksMCwxLjAxNS0wLjI4OCwxLjI3LTAuNzUxbDAuNjMxLTEuMTQ2YzAuMjc2LTAuNTA0LDAuNjg5LTAuOTE2LDEuMTkzLTEuMTlsMS4xNS0wLjYyNiAgICBDMjAuNzExLDE3LjAxOSwyMSwxNi41MzEsMjEsMTZTMjAuNzExLDE0Ljk4MSwyMC4yNDMsMTQuNzI3eiIvPjwvZz48L2c+PC9zdmc+"
const metadata:NFTtokenMetadata=new NFTtokenMetadata(
 "string", // ex. "Arch Nemesis: Mail Carrier" or "Parcel #5055"
  "string", // free-form description
  "https://bafkreiaxotuu535stf35clnaz57obf7zjipvxbr7hiv4iu5o6gin52mljm.ipfs.dweb.link/", // URL to associated media, preferably to decentralized, content-addressed storage
  "string", // Base64-encoded sha256 hash of content referenced by the `media` field. Required if `media` is included.
  new u128(1), // number of copies of this set of metadata in existence when token was minted.
  "", // When token was issued or minted, Unix epoch in milliseconds
  "", // When token expires, Unix epoch in milliseconds
  "", // When token starts being valid, Unix epoch in milliseconds
  "", // When token was last updated, Unix epoch in milliseconds
  "", // anything extra the NFT wants to store on-chain. Can be stringified JSON.
  "", // URL to an off-chain JSON file with more info.
  "" // Base64-encoded sha256 hash of JSON from reference field. Required if `reference` is included.
);
/* 
export function nft_transfer(
    receiver_id: string,
    token_id: string,
    approval_id: number,
    memo: string): void {
    return
}
export function nft_transfer_call(
    receiver_id: string,
    token_id: string,
    approval_id: number,
    memo: string,
    msg: string,
  ): void {
      return
  }

  export  function nft_resolve_transfer(
    owner_id: string,
    receiver_id: string,
    token_id: string,
    approved_account_ids: Map<string, number>|null,
  ): boolean {
      return false
  } */

// Returns the token with the given `token_id` or `null` if no such token.
/* export function nft_token(token_id: string): Token|null { */
     /*  return new Token("1", "doc_failure.testnet", metadata); */
 /*     return null
// 
 */
/*
export function ft_balance_of(account_id: string): string {
    return ft_balance_of_impl(account_id).toString();
}
 */
export function nft_initialize():void{
    nft_initialize_impl("nft-name", "nft-symbl", base64TokenSvg, "", "", "");
}

export function nft_mint( receiver_id: string, token_id: string, metadata:NFTtokenMetadata):void{
    nft_mint_impl( receiver_id, token_id, metadata);
}

/* export function nft_mint_batch(owner_ids: string[], metadata: NFTtokenMetadata): void {
  return;
}
 */
export function nft_metadata():NFTContractMetadata | null{
   return nft_metadata_impl();
}

  // Query for all the tokens for an owner
  export function nft_tokens_for_owner(account_id: string): Array<Token>{
    return nft_tokens_for_owner_impl(account_id, u128.Zero, u128.Max);
  }

  export function nft_supply_for_owner( account_id: string ): number {
      return nft_supply_for_owner_impl(account_id);
  }

  export function nft_total_supply(): number {
    return nft_total_supply_impl();
  }

/*   export function nft_on_transfer( sender_id: string,  previous_owner_id: string, token_id: string, msg: string ): void{
      return
  }; */