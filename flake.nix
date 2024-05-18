# vim:ft=nix:ts=2:sts=2:sw=2:et:
{
  description = "A dev environment for java";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    nix-vscode-extensions.url = "github:nix-community/nix-vscode-extensions";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    nix-vscode-extensions,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          system = "${system}";
        };

        codium = pkgs.vscode-with-extensions.override {
          vscode = pkgs.vscodium;
          vscodeExtensions = with nix-vscode-extensions.extensions.${system}.vscode-marketplace; [
            mhutchie.git-graph
            aaron-bond.better-comments
          ];
        };
      in rec {
        name = "goofy-plugin";
        apps = rec {
          taskFor = { }: {
            type = "app";
            program = "${pkgs.writeScript "${name}-run" ''
              #!${pkgs.bash}/bin/bash
              node .
            ''}";
          };
          run = taskFor {
            task = "runClient";
            minecraft = "1.20.1";
            minecraft-out = "1.20.4";
            fabric-api = "0.83.0";
            loom = "1.2-SNAPSHOT";
          };
          default = run1;

          code.type = "app";
          code.program = with pkgs; "${writeScript "${name}-code" ''
            #!${bash}/bin/bash
            exec nix develop -c ${codium}/bin/codium --verbose -w . "$@"
          ''}";
        };
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [nix git gh bashInteractive nodePackages_latest.nodejs nodePackages_latest.nodemon nodePackages_latest.ts-node];
        };
      }
    );
}
