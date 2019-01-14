package BattleShip;

public class Destroyer extends Ship {

	private final char OPERATIONAL_HULL = 'D';
	private final char DAMAGED_HULL = 'd';
	
	public Destroyer( String name )
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
		return 3;
	}

	public static void main(String[] args)
	{
		// TODO Auto-generated method stub
	}

}
