// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Counter {
  uint public x;

  event Increment(uint by);
  event Decrement(uint by);
  event Reset();

  function inc() public {
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }

  function dec() public {
    require(x > 0, "dec: counter is already zero");
    x--;
    emit Decrement(1);
  }

  function decBy(uint by) public {
    require(by > 0, "decBy: decrement should be positive");
    require(x >= by, "decBy: decrement too large");
    x -= by;
    emit Decrement(by);
  }

  function reset() public {
    x = 0;
    emit Reset();
  }

  function get() public view returns (uint) {
    return x;
  }
}
