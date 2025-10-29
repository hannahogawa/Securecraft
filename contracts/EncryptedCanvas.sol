// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title EncryptedCanvas
/// @notice Stores player usernames and encrypted drawing selections on a 4x4 grid.
contract EncryptedCanvas is SepoliaConfig {
    struct PlayerData {
        string username;
        euint32 selection;
        bool registered;
        bool hasSelection;
    }

    mapping(address => PlayerData) private players;
    address[] private playerDirectory;

    event PlayerRegistered(address indexed player, string username);
    event SelectionUpdated(address indexed player);

    error UsernameRequired();
    error AlreadyRegistered();
    error NotRegistered();

    /// @notice Registers the sender with a username and initial empty selection.
    /// @param username The chosen username for the player.
    function registerPlayer(string calldata username) external {
        if (bytes(username).length == 0) {
            revert UsernameRequired();
        }

        PlayerData storage player = players[msg.sender];
        if (player.registered) {
            revert AlreadyRegistered();
        }

        player.username = username;
        euint32 emptySelection = FHE.asEuint32(0);
        player.selection = emptySelection;
        player.registered = true;
        player.hasSelection = false;

        FHE.allowThis(emptySelection);
        FHE.allow(emptySelection, msg.sender);

        playerDirectory.push(msg.sender);

        emit PlayerRegistered(msg.sender, username);
    }

    /// @notice Updates the encrypted grid selection for the sender.
    /// @param encryptedSelectionHandle Handle referencing the encrypted selection.
    /// @param inputProof Proof associated with the encrypted selection handle.
    function updateSelection(
        externalEuint32 encryptedSelectionHandle,
        bytes calldata inputProof
    ) external {
        PlayerData storage player = players[msg.sender];
        if (!player.registered) {
            revert NotRegistered();
        }

        euint32 encryptedSelection = FHE.fromExternal(encryptedSelectionHandle, inputProof);

        player.selection = encryptedSelection;
        player.hasSelection = true;

        FHE.allowThis(encryptedSelection);
        FHE.allow(encryptedSelection, msg.sender);

        emit SelectionUpdated(msg.sender);
    }

    /// @notice Returns the stored data for a player.
    /// @param playerAddress The address of the player.
    /// @return username The registered username.
    /// @return registered Indicates if the player is registered.
    /// @return hasSelection Indicates if the player has submitted a grid selection.
    /// @return selection The encrypted grid selection.
    function getPlayer(address playerAddress)
        external
        view
        returns (string memory username, bool registered, bool hasSelection, euint32 selection)
    {
        PlayerData storage player = players[playerAddress];
        return (player.username, player.registered, player.hasSelection, player.selection);
    }

    /// @notice Retrieves the list of all registered player addresses.
    /// @return addresses All registered player addresses.
    function getRegisteredPlayers() external view returns (address[] memory addresses) {
        return playerDirectory;
    }
}
