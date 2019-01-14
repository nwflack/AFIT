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
	
	public abstract char drawShipStatusAtCell( boolean isDamaged );
	
	public abstract int getLength();
	
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
