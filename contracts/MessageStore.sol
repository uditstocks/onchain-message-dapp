// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title MessageStore
/// @notice Stores one personal message per wallet address, on-chain.
/// @dev Each wallet can overwrite its own message at any time. Reads are free.
contract MessageStore {
    // wallet address => their current message
    mapping(address => string) private messages;

    /// @notice Emitted whenever a user sets or updates their message.
    event MessageSet(address indexed user, string message);

    /// @notice Save (or overwrite) the caller's message.
    /// @dev Tied to msg.sender, so a user can only ever change their own message.
    function setMessage(string calldata message) external {
        messages[msg.sender] = message;
        emit MessageSet(msg.sender, message);
    }

    /// @notice Read any wallet's current message.
    function getMessage(address user) external view returns (string memory) {
        return messages[user];
    }
}
