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
            dbaeumer.vscode-eslint
          ];
        };
      in rec {
        name = "goofy-plugin";
        apps = rec {
          taskFor = { task }: {
            type = "app";
            program = "${pkgs.writeScript "${name}-run" ''
              #!${pkgs.bash}/bin/bash
              exec ${pkgs.nix}/bin/nix develop -c nodemon -x 'node index.js || touch index.js' | ${pkgs.coreutils}/bin/tee -a logs.log
            ''}";
          };
          run = taskFor {
            task = "runBot";
          };
          default = run;

          code.type = "app";
          code.program = with pkgs; "${writeScript "${name}-code" ''
            #!${bash}/bin/bash
            exec ${pkgs.nix}/bin/nix develop path:${./.} -c ${codium}/bin/codium --verbose -w . "$@"
          ''}";
        };
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [nix git gh bashInteractive neofetch] ++ (with nodePackages_latest; [nodejs nodemon eslint]);
        };
        packages.node_modules = pkgs.runCommand "node_modules" {
          buildInputs = [pkgs.nodePackages_latest.nodejs];
          outputHashMode = "recursive";
          outputHash = "sha256:" + pkgs.lib.fakeSha256;
        } ''
          ln -s ${./package.json} package.json
          ln -s ${./package-lock.json} package-lock.json
          npm i
          mv node_modules $out
        '';
      }
    );
}
