pragma solidity ^0.5.10;

import "@openzeppelin/contracts/ownership/Ownable.sol";

/**
 * @title Simple Storage
 * @dev A simple contract to save a number.
 */
contract SimpleStorage {

    uint256 private storedData;

    /**
     * @dev Set the number to be saved.
     * @param x uint256 The number to be saved.
     */
    function set(uint256 x) public {
        storedData = x;
    }

    /**
     * @dev Gets the saved number.
     * @return An uint256 representing the saved number.
     */
    function get() public view returns (uint256) {
        return storedData;
    }
}


/**
 * @title Public Storage
 * @dev Learn about public contract variables.
 */
contract PublicStorage {

    uint256 public storedData;

    /**
     * @dev Set the number to be saved.
     * @param x uint256 The number to be saved.
     */
    function set(uint256 x) public {
        storedData = x;
    }
}


/**
 * @title Simple Table
 * @dev Learn about mappings.
 */
contract SimpleTable {
    mapping (uint256 => uint256) private table;

    function set(uint256 key, uint256 value)
        public
    {
        table[key] = value;
    }

    function get(uint256 key)
        public
        view
        returns (uint256)
    {
        return table[key];
    }
}

/**
 * @title User Table
 * @dev Learn about msg.sender.
 */
contract UserTable {
    mapping (address => uint256) private table;

    function set(uint256 value)
        public
    {
        table[msg.sender] = value;
    }

    function get()
        public
        view
        returns (uint256)
    {
        return table[msg.sender];
    }
}

/**
 * @title Proprietary Table
 * @dev Learn about constructor and require.
 */
contract ProprietaryTable {
    address public owner;
    mapping (uint256 => uint256) private table;

    constructor ()
        public
    {
        owner = msg.sender;
    }

    function set(uint256 key, uint256 value)
        public
    {
        require(msg.sender == owner, "Restricted to owner.");
        table[key] = value;
    }

    function get(uint256 key)
        public
        view
        returns (uint256)
    {
        return table[key];
    }
}

/**
 * @title Modifier Table
 * @dev Learn about modifiers.
 */
contract ModifierTable {
    address public owner;
    mapping (uint256 => uint256) private table;

    constructor ()
        public
    {
        owner = msg.sender;
    }

    modifier onlyOwner()
    {
        require(msg.sender == owner, "Restricted to owner.");
        _;
    }

    function set(uint256 key, uint256 value)
        public
        onlyOwner
    {
        table[key] = value;
    }

    function get(uint256 key)
        public
        view
        returns (uint256)
    {
        return table[key];
    }
}

/**
 * @title Ownable Table
 * @dev Learn about inheritance.
 */
contract OwnableTable is Ownable {
    mapping (uint256 => uint256) private table;

    constructor () Ownable()
        public
    {}

    function set(uint256 key, uint256 value)
        public
        onlyOwner
    {
        table[key] = value;
    }

    function get(uint256 key)
        public
        view
        returns (uint256)
    {
        return table[key];
    }
}

/**
 * @title Event Table
 * @dev Learn about events.
 */
contract EventTable is Ownable {
    event ValueAdded(uint256 key, uint256 value);

    mapping (uint256 => uint256) private table;

    constructor () Ownable()
        public
    {}

    function set(uint256 key, uint256 value)
        public
        onlyOwner
    {
        table[key] = value;
        emit ValueAdded(key, value);
    }

    function get(uint256 key)
        public
        view
        returns (uint256)
    {
        return table[key];
    }
}

/**
 * @title Document Registry
 * @dev Real use case: This contract is my personal registry of documents I've verified.
 * Anyone with any document can calculate its hash and if they know the address of this
 * contract assess whether it's a document I've verified or not.
 */
contract DocumentRegistry is Ownable {
    event EntryAdded(uint256 hash);

    mapping (uint256 => uint256) private registry;

    constructor () Ownable()
        public
    {}

    function set(uint256 hash)
        public
        onlyOwner
    {
        registry[hash] = now;
        emit EntryAdded(hash);
    }

    function get(uint256 hash)
        public
        view
        returns (uint256)
    {
        return registry[hash];
    }
}