package BattleShip;

public class Position
{
	public int x = 0;
	public int y = 0;
	
	public Position( int x, int y )
	{
		this.x = x;
		this.y = y;
	}
	
	public boolean equals( Position p )
	{
		if( this.x == p.x && this.y == p.y )
			return true;
		return false;
	}

	public static void main( String [] args )
	{
		//String input = "hello world, how    are   you today?\n I am good...";
		String input = "12, 34.21,  987.23  adf -232.1 ";

		System.out.println( input );

		String [] ss = input.split( "(\\s|,)+" );
		//String [] ss = input.split( "[0-9]+" );

		for( int i = 0; i < ss.length; ++i )
		{
         System.out.print(i + ": " + ss[i]);
         System.out.println( "   - is floating point? " + ss[i].matches("[-+]?[0-9]*\\.?[0-9]*.") );
      }
	}
}
