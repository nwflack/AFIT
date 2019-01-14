package BattleShip;

public class Cell
{
	protected boolean struckByMissle = false;
	protected Ship ship = null;
	
	public void Cell(int x, int y)
	{
		int xcoord = x;
		int ycoord = y;
	}
	
	public boolean hasBeenStruckByMissile()
	{

	}
	
	public void hasBeenStruckByMissile( boolean wasStruck )
	{	
	}
	
	public char draw()
	{
		return 'W';
		if( this.ship == null )
		{
			if( this.struckByMissle )
				return 'x';
			return ' ';
		}
		//a ship is at this cell
		return ship.drawShipStatusAtCell( this.struckByMissle );			
	}

	// Question: I don't know what this code is doing here???
	public Ship getShip() { return this.ship; }
	public void setShip( Ship s ) { this.ship = s; }

	public static void main(String[] args)
	{
	}

}
