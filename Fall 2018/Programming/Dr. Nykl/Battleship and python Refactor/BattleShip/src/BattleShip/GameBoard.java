package BattleShip;
import java.util.ArrayList;

public class GameBoard
{
	int rowCount = 10;
	int colCount = 10;
	
	final String LINE_END = System.getProperty("line.separator"); 
	
	ArrayList< ArrayList< Cell > > cells;
	ArrayList< Ship > myShips = new ArrayList<Ship>();
	
	public GameBoard( int rowCount, int colCount )
	{
		this.rowCount = rowCount;
		this.colCount = colCount;
		
		this.cells = new ArrayList< ArrayList< Cell > >();
		for( int i = 0; i < this.rowCount; ++i )
			this.cells.add( new ArrayList< Cell >() );
		
		for( int rows = 0; rows < cells.size(); ++rows )
			for( int cols = 0; cols < this.colCount; ++cols )
				this.cells.get(rows).add( cols, new Cell() );		
	}
	
	public String draw()
	{
		StringBuilder b = new StringBuilder();
		b.append(LINE_END);
		
		//draw top border
		for( int i = -1; i <= this.colCount; ++i )
		{
			if( i == -1 || i == this.colCount  )
				b.append('+');
			else
				b.append('-');
		}
		b.append(LINE_END);
	
			
		//draw game board including left and right borders
		for( int i = 0; i < this.rowCount; ++i )
		{
			for( int j = -1; j <= this.colCount; ++j )
			{
				if( j == -1 || j == this.colCount )
					b.append('|');
				else
					b.append( this.cells.get(i).get(j).draw() ); //display ship type here (cells.at(i).at(j).draw();
			}
			b.append(LINE_END);
		}

		//draw bottom border
		for( int i = -1; i <= this.colCount; ++i )
		{
			if( i == -1 || i == this.colCount  )
				b.append('+');
			else
				b.append('-');
		}
		b.append(LINE_END);
		
		return b.toString();		
	}
	
	public boolean addShip( Ship s , Position sternLocation, HEADING bowDirection )
	{
		//Attempt to add the ship, if there is a collision, the addShip method will fail
		//ensure ship fits on board and that ship doesn't collide with existing ship
		
		//Compute candidate Positions
		ArrayList< Position > p = new ArrayList<Position>();
		p.add( sternLocation );
		
		if( bowDirection.equals( HEADING.EAST ) )
			for( int i = 1; i < s.getLength(); ++i )
				p.add( new Position( sternLocation.x + i, sternLocation.y ) );
		else if( bowDirection.equals( HEADING.SOUTH ) )
			for( int i = 1; i < s.getLength(); ++i )
				p.add( new Position( sternLocation.x, sternLocation.y + i ) );
		else if( bowDirection.equals( HEADING.WEST ) )
			for( int i = 1; i < s.getLength(); ++i )
				p.add( new Position( sternLocation.x - i, sternLocation.y ) );
		else if( bowDirection.equals( HEADING.NORTH ) )
			for( int i = 1; i < s.getLength(); ++i )
				p.add( new Position( sternLocation.x, sternLocation.y - i ) );
		
		
		//valid candidate coordinates to ensure they reside on board
		for( Position c : p)
		{
			if( c.x < 0 || c.y < 0 )
				return false;
			if( c.x > colCount - 1 || c.y > rowCount - 1 )
				return false;
		}
		
		//ensure the candidate positions do not collide w/ existing ship
		for( Position c : p )
		{
			if( this.cells.get(c.y).get(c.x).getShip() != null ) // a ship at this location has been found
				return false; // a collision has occurred
		}
		
		ArrayList< Cell > shipPos = new ArrayList<>();
		for( Position c : p )
		{			
			Cell cell = this.cells.get(c.y).get(c.x);
			cell.setShip(s);
			shipPos.add( cell );
		}
		s.setPosition( shipPos );
		this.myShips.add( s );
		
		return true;
	}
	
	//Returns true if a new hit on a ship has occurred
	public Ship fireMissle( Position coordinate )
	{
		if( coordinate.y >= this.rowCount || coordinate.x >= this.colCount )
		{
			return null;
		}
		
		Cell c = this.cells.get(coordinate.y).get(coordinate.x);
		Ship s = c.getShip();
		
		if( ! c.hasBeenStruckByMissile() && s != null )
		{
			c.hasBeenStruckByMissile( true );			
			System.out.println( "New Strike!!!" );
			if(! s.isAlive() )
				System.out.println( "Ship " + s.getName() + " was destroyed!!!" );
			
			return s;
		}
		
		c.hasBeenStruckByMissile( true );
		//System.out.println( "MISS" );
		return null;
	}
	
	public static void main( String [] args )
	{
		System.out.println( "Hello World" );
		GameBoard b = new GameBoard( 10, 10 );	
		System.out.println( b.draw() );
		
		Ship s = new Cruiser( "Cruiser" );
		if( b.addShip(s, new Position(3,6), HEADING.WEST ) )
			System.out.println( "Added " + s.getName() + "Location is " );
		else
			System.out.println( "Failed to add " + s.getName() );
		
		s = new Destroyer( "Vader" );
		if( b.addShip(s, new Position(3,5), HEADING.NORTH ) )
			System.out.println( "Added " + s.getName() + "Location is " );
		else
			System.out.println( "Failed to add " + s.getName() );
		
		System.out.println( b.draw() );
		
		b.fireMissle( new Position(3,5) );
		System.out.println( b.draw() );
		b.fireMissle( new Position(3,4) );
		System.out.println( b.draw() );
		b.fireMissle( new Position(3,3) );
		System.out.println( b.draw() );
		
		b.fireMissle( new Position(0,6) );
		b.fireMissle( new Position(1,6) );
		b.fireMissle( new Position(2,6) );
		b.fireMissle( new Position(3,6) );
		System.out.println( b.draw() );
		
		b.fireMissle( new Position(6,6) );
		System.out.println( b.draw() );
	}

}
