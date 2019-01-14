package BattleShip;

public class Cruiser extends Ship
{
	private final char OPERATIONAL_HULL = 'C';
	private final char DAMAGED_HULL = 'c';
	
	public Cruiser( String name )
	{
		super( name );
	}

	@Override
	public char drawShipStatusAtCell( boolean isDamaged )
	{
		if( isDamaged )
			return this.DAMAGED_HULL;
		return this.OPERATIONAL_HULL;
	}

	@Override
	public int getLength()
	{
		return 4;
	}

	public static void main(String[] args)
	{
		// TODO Auto-generated method stub
	}
}
