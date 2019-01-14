package BattleShip;

import java.util.ArrayList;

abstract public class Ship
{
	protected ArrayList< Cell > position = null;
	protected String name = "Unnamed";
	
	public Ship( String name )
	{
		this.name = name;
	}
	
	public void setPosition( ArrayList< Cell > position )
	{
		this.position = position;
	}
	
	//must override in cruiser and destroyer
	public abstract char drawShipStatusAtCell( boolean isDamaged );

	//must override in cruiser and destroyer
	public abstract int getLength();

	//Is isAlive() looking for all positions the ship is covering or just current position???
	public boolean isAlive()
	{
		for( Cell c : this.position )
			if( ! c.hasBeenStruckByMissile() )
				return true;
		return false;
	}
	
	public int getMaxDamage()
	{
		return this.getLength();
	}
	
	
	public String getName() { return this.name; }

}
