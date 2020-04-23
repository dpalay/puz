#!/usr/bin/perl -w
use strict;
=wordpuzzle   Initial documentation
This is yet another rendition of the hidden word puzzle program.  The intent is to
create a program that reads words given as text and then creates a compact, square
hidden word puzzle that contains all of the given words.  The actual algorithm
was developed over 30 years a go in FORTRAN.  Since then it has been redeveopled
and coded in various languages and on different machines.  In this case the program
is being written in PERL.  The algorithm will be adjusted to take advantage of some
unique PERl features such as hashes and long strings.

The basic structure is:
   Get some user supplied data (name of input file, tracing level, minimum word length)
   Read the set of words (ignoring duplicates and too short words)
   Determine the minimum size fo the puzzle and set parameters to handle
         two dimensional array references as well as various other co0nstructs.
   Make the puzzle so that we maximize the overlap of each new word, expanding the
         puzzle when need be.  ALso, build up a string of the characters actually
         placed into the pussle.
   Produce a puzzle with blanks left as blanks.
   Fill in the blanks of the puzzle with a randpom selection from the string of
         characters that had been placed into the puzzle.
   Produce a puzzle.
The output will be an HTML file that contains the puzzle and the lists of words.

Other notes:
  DIRECTIONS
     The program refers to directions in which the word is placed into the puzzle.
     There are eight directions given as
                  7         8         1
                    \       ^       /
                      \     |     /
                        \   |   /
                          \ | /
                 6 <--------o--------> 2
                          / | \
                        /   |   \
                      /     |     \
                    /       V       \
                  5         4         3
   STORING WORDS IN ALPHABETIC ORDER
      The program stores each word found that is of sufficient length in a hash structure where the
      word is the key of the hash and the value is the constant 1
   STORING WORDS in LENGTH and ALPHA ORDER
      The program stores each word found that is of sufficient length in a hash structure where the
      word prefixed by a two character string giving the word length is the key of the hash and the
      value is the constant 1
   WORD PLACEMENT IN THE PUZZLE
      The goal is to place the words into the puzzle in the most compact mannor with the greatest
      overlap of words and with the broadest use of all eight directions.  The algorithm employed
      does not do any backtracking to improve efficiency, but it does take steps to build in brevity.

      The longest word is always placed first.  Thereafter the words are placed longest to shortest
      into the puzzle such that for any placement we maximize the overlap of new letters with letters
      that are already in the puzzle.  If there are two or more places with equal overlap, then the
      overlap that uses a less frequently used direction is used.  If there is an equal overlap and
      the placements have equally used frequency, then the selection is random (using the Palay
      progressive randomization selection algorithm).

   FINDING WORD PLACEMENT
      In order to find possible locations for a word, we want to look at places where the letters of
      the word already exist.  Rather than scan through the puzzle looking for matches  to each letter
      of the word, we will keep track of the location of each of the 26 different letters within the
      puzzle.  We will do this with an intermingled stack with 26 heads.  Thus, for each word to be
      added to the puzzle, we can look at each letter of the word and find all occurances of that
      letter already in the puzzle.

   SEGMENTED WORDS
      There are times when the user may want a pair of words to be treated as a single word.  For
      example, in a puzzle that is made up of the names of cities, the name ANN ARBOR should be
      treated as a single word.  It would not make sense to enter it as ANNARBOR.  Rather, we wish
      to keep it as a nine character word where the fourth character in the actual puzzle is ignored.
      This program allows such a construct.  The input text needs to employ the underscore to keep
      the word together.  Thus, Ann_Arbor would be treated as the single nine character word
      ANN ARBOR.

=cut back to the actual program

my $t_l = 5;    # trace level, which we may want to let the user modify
my $InFileName;    # holds the name of the input file
my $intext;        # used to hold the input text
my $outtext;       # holds text being assembled for output
my @puzzle;        # holds the actual puzzle as it is constructed
my $user_response; # holds a message from the user
my $lettersused;   # this string will hold all of the letters that have been placed into
                      # the puzzle  (during testing we may just give this a value)
my $numLettersUsed; # holds the number of letters used
my $puzSize;       # the starting size of the puzzle, giving the number of rows and columns
my $maxSize;       # both the max size (# rows and columns) of the puzzle and an important value
                      # for the algorithm to translate a 1-dimensional list to a 2-dimensional array.
my $numWords;      # holds the number of distinct words found
my $numLetters;    # holds the number of letters found in the input words that are distinct and long enough
my $minWordSize;   # holds the minimum word size allowed
my $maxWordLen;    # holds the length, in characters, of the longest word found
my @delta_x=(0,1,1,1,0,-1,-1,-1,0) ; # this represents the change in x coordinate v alues for moving
                                     # in one of eight directions, element zero is ignored.
my @delta_y=(0,-1,0,1,1,1,0,-1,-1) ; # this represents the change in y coordinate v alues for moving
                                     # in one of eight directions, element zero is ignored.
my @directionuse;  # holds the number of words going in each direction
my @letter_head;   # list of the heads of the 26 stacks holding the location of existing letters in
                         # the puzzle
my @letter_stack;  # pointers to the next item in the stack
my @letter_x_val;  # parallel to @letter_stack;  holds the x-coordinate in a stack of letter possitions
my @letter_y_val;  # parallel to @letter_stack;  holds the y-coordinate in a stack of letter possitions
my $letter_next = 1;  # holds the next available item in the stack.
my $letters="_ABCDEFGHIJKLMNOPQRSTUVWXYZ";  # obviously the upper case letters of the alphabet,
                      # along with the underscore.
my %words;         # holds the hash list of the different words
my %lenwords;      # holds the hash list of the different length prepended words
my $thisword;      # holds a word for placement into puzzle
my $thislenword;   # holds the length prepended version of a word to be placed into the pussle
my $start_x;       # holds the x coordinate of the start of a word
my $start_y;       # holds the y coordinate of the start of a word
my $dir_this;      # holds the direction chosen for the word.
my $best_overlap=0;

my $TRUE = 1;
my $FALSE= 0;



general_initialize();
set_parameters();

get_words();
place_words();
write_puzzle("Enter the name of the file to hold the non-filled puzzle: ");
fill_puzzle();
write_puzzle("Enter the name of the file to hold the puzzle: ");


# ------------------------------------------------------

sub general_initialize
  { # in this procedure we will set up the various values that we need and initial major constructs
    #     where possible
    my $i;
    my $x;
    print "Welcome to the Puzzle program, a program designed to make hidden word puzzles.\n";
    print "This program can trace its progress though printed messages.  Tracing is controlled\n";
    print "by a numeric value within the program.  The current value is '$t_l'.  The higher the \n";
    print "value (in the range 0 to 9) the more diagnostic output will be generated. \n";
    print "Please enter a new trace value (0 to 9): ";
    $x=<STDIN>;
    chomp $x;
    $x.=" ";
    if (length($x) gt 1 )
       { $t_l = $x;
         print "Trace level now set to $t_l\n";
       }
    if ($t_l > 7 ) { print "ECHO of the Directions...\n";
                     for ($i=0;$i<=8;$i++)
                       { print " Direction $i has Delta_x=$delta_x[$i] and Delta_y=$delta_y[$i]\n" }
                   }
    for ($i=0;$i<=26;$i++){ $letter_head[$i]=-1 };
    if ($t_l > 7 ) {print "done setting up the 26 heads for the intermixed letter location stack\n";}
  }


# ------------------------------------------------------

sub get_words
  { my $x;
    my $linesread = 0;
    my @wordlist;
    my ($i,$j,$k);
    my $numwords;
    my $thisword;
    my $lengthandword;
    my $thislen;

    $maxWordLen = 0;
    $numWords=0;
    $numLetters = 0;

    print "\nEnter the name of the input file: ";
    $x=<STDIN>;
    chomp($x);
    $InFileName = $x;
    open( INFILE, $InFileName ) || die "Could not open the input file $InFileName.  Program terminates.";
    if( $t_l > 2 )
       {print "Start reading $InFileName...\n"}
    while ($x = <INFILE> )
      { $linesread++;
        chomp($x);
        if ($t_l > 6) {print "Input line $linesread:'$x'\n"}
        $x=uc($x);
        if ($t_l > 7 ) {print "   convert to uc:'$x'\n"}
        $x=make_word_list($x);
        if ($t_l > 7 ) {print " convert to list:'$x'\n"}
        # now we will change the string into a list of words, and for each word we will
        # make sure it is long enough and if so then is it new, if so then add it to the
        # alphabetic hash, create the length prepended text and add that to the length-alpha
        # hash.
        @wordlist = split(",",$x);
        $numwords=scalar @wordlist;
        if ($t_l > 8) {print "Number of words in line is $numwords.\n";}
        for ($i=0; $i<$numwords; $i++ )
           {
             if ($t_l > 7 ) {print "consider word $i which is $wordlist[$i]\n";}
             $thisword=$wordlist[$i];
             $thislen =length( $thisword );
             if ( $thislen >= $minWordSize )
                { # this word is long enough to qualify, have we seen it before?
                  # but before we look, ledt us change any embedded underscore to a blank
                  while ( ($j=index($thisword,"_") ) >= 0 )
                       { substr($thisword,$j,1) = " "}
                  if (exists $words{ $thisword } )
                    { # we have seen this word before so there is nothing to do
                       if ($t_l > 8) {print "$thisword is already in the hash, skip it.\n"}
                    }
                  else { # this is a new word, add it to the has
                           $words{ $thisword } = 1;
                           $lengthandword="L".($thislen+1000).$thisword;
                           $lengthandword=substr($lengthandword,3);
                           $lenwords{ $lengthandword } = 1;
                           if ($t_l > 8 ) {print "add $thisword to one hash and $lengthandword to the other\n"}
                           if ($thislen > $maxWordLen ) {$maxWordLen = $thislen }
                           $numWords++;
                           $numLetters += $thislen;

                        }
                }
              else
                { # word is too short
                  if ($t_l > 8) {print "$thisword is too short, skip it.\n"}
                }
           }
      }
    if ($t_l > 3 )
       {print "completed reading $linesread lines and we found,\n";
        print "$numWords different words using $numLetters different letters\n";
        print "where the longest word was $maxWordLen characters long.\n";
       }
    if ($t_l > 7 )
       { foreach $k  (sort keys %words )
           { print "$k\n" }
         foreach $k  (reverse (sort keys %lenwords) )
           { print "$k\n" }
       }
  }



# ------------------------------------------------------

sub make_word_list
  {my @lines=@_;
   # this routine scans the parameter string, removes all extraneous characters, and places a
   # comma between words
   my $x;
   ($x)=@lines;
   my $i;
   my $y;
   my $last_a_comma;
   $y="";
   $last_a_comma = $TRUE;
   if( $t_l > 8 ) {print "in make_word_list process '$x'\n";}
   for ($i=0; $i<length($x);$i++)
     {#if we are at a valid character, then append it to new string and mark last not to be a comma
      #   else if last was not a comma, append a comma and mark last to be a comma
      if( index( $letters, substr($x,$i,1) ) >=0 )
        { $y.=substr($x,$i,1);
          $last_a_comma=$FALSE;
        }
       else
        { if (! $last_a_comma )
            { $y.=",";
              $last_a_comma=$TRUE;
            }
        }
     }
    if (length($y)>0)
      { if (substr($y, (length($y)-1),1) eq ",")
             { $y= substr($y, 0, -1)}
      }
    if ($t_l>8)
       {print "from make_word_list produce '$y'\n"}
    return $y;
  }



# ------------------------------------------------------

sub set_parameters
  {my $x;
   print "Enter the length of the shortest acceptable word: ";
   $x=<STDIN>;
   chomp $x;
   $minWordSize = $x;

  }


# ------------------------------------------------------

sub place_words
  { # this procedure will take each word from the length-word list, in reverse order,
    # and place it into the puzzle in order to maximize overlap with existing
    # letters and to spread the distribution of directions for placing the
    # words.  If a word cannot be placed with an overlap, then we will try to
    # fit in the word in an existing open space.  Should the word stll not fit in,
    # then we will increase the puzzle by adding a row and column and we will
    # try the process again.  Note that we will try for an overlap first and then
    # return to the open spot search which will have to work on the second time.

    # We need to set an initial puzzle size, set up the blank puzzle, initialize the
    # tally of direction use, and initialize the string of all letters actually
    # placed into the puzzle.

    my ($i, $j, $k, $x, $y, $z );
    my $wordnum;

    # we will get an initial size from the number of characters in the qualitied words
    # and the number of those words, along with the length of the longest word.

    $x= int( sqrt( $numLetters - $numWords ) )+1;
    $puzSize = ($x > $maxWordLen ) ? $x : $maxWordLen ;
    $maxSize = $puzSize+10;
    if ($t_l >4 ) {print "Starting to create puzzle, from $numLetters letters in $numWords words we get a\n";
                   print "calculated size=$x;  with longest word size=$maxWordLen we set the\n" ;
                   print "Initial puzzle size = $puzSize\n";
                  }
    blank_full_puzzle();
    surround_dash();
    for ($i=0;$i<=8;$i++) {$directionuse[$i]=0}
    $wordnum = 0;
    foreach $thislenword  (reverse (sort keys %lenwords) )
       { #first trim off the two character length
         $thisword = substr( $thislenword, 2);
         if ($t_l > 7 ) {print "Try to connect '$thisword' into the puzzle.\n" }
         $wordnum++;
         if ($wordnum == 1 )
            { #placing the first word is a special case
              $start_x = $puzSize;
              $start_y = $puzSize;
              $dir_this = 7;
            }
         else
            { my $DONE;
              $DONE = overlap();
              if (!$DONE) {$DONE = insertword()}
              if (!$DONE) {increase_puzzle_size();
                           $DONE = overlap();
                          }
              if (!$DONE) { insertword() }
            }
         plop_word();
         if ($t_l >7 ) { print "Word '$thisword' placed at $start_x,$start_y going in direction $dir_this";
                         print "   with overlap = $best_overlap\n";
                         print "   Directionuse = ";
                         for ($i=1; $i<=8; $i++) { print " $i-->$directionuse[$i]  "}
                         print "\n";
                         dump_puzzle()}
        }
    if ($t_l > 4) { print "Direction use:\n";
                    for ($i=1; $i<=8; $i++)
                       { print " $i-->$directionuse[$i]\n" }
                    dump_puzzle();
                  }
  }


# ------------------------------------------------------

sub surround_dash
  {# this routine will surround the existing blank puzzle, at the initial puzzle size, with dash
   # characters.  This is done to help later as we try to insert words.  We know that we will
   # find a mismatch before we run off the puzzle.
   my $i;
   for ($i=0; $i<=$puzSize+1; $i++ )
     { $puzzle[mapFromTwo($i,0)] = "-";
       $puzzle[mapFromTwo(0,$i)] = "-";
       $puzzle[mapFromTwo($puzSize+1,$i)] = "-";
       $puzzle[mapFromTwo($i,$puzSize+1)] = "-";
     }
   if ($t_l > 6 ) {dump_puzzle();
                  }
  }


# ------------------------------------------------------

sub blank_full_puzzle
  {my $i;
   my $mss = $maxSize*$maxSize;
   for ($i = 0; $i<$mss; $i++) {$puzzle[$i]=" "}
   return
  }


# ------------------------------------------------------

sub dump_puzzle
  {my ($i,$j);
   for ($j=0; $j<=$puzSize+1; $j++)
     { for ($i=0; $i<=$puzSize+1; $i++)
         {print " $puzzle[mapFromTwo($i,$j)] " };
       print "\n";
     }
   print "Press enter to continue:";
   $i=<STDIN>;

  }


# ------------------------------------------------------

sub plop_word
  { # this routine will add the word $thisword into the puzle starting at
    # $start_x,$start_y and going din direction $dir_this.  We will not only
    # put the word into the puzzle, we will add the location of each new
    # letter of the puzzle to the stack of locations, and we will build up the
    # string of all letters used.
    my ($x, $y, $z, $i, $j, $k, $dx, $dy );
    $x = $start_x;
    $y = $start_y;
    $dx = $delta_x[ $dir_this ];
    $dy = $delta_y[ $dir_this ];
    $directionuse[ $dir_this ]++;
    for ($j=0; $j<(length $thisword); $j++)
       { if ( $puzzle[ mapFromTwo($x,$y) ] eq " " )
           {  $z=substr( $thisword, $j, 1 );
              $puzzle[ mapFromTwo($x,$y) ] = $z;
              if ($z ne " ")
                { $k = index($letters, $z);
                  $letter_x_val[ $letter_next ] = $x;
                  $letter_y_val[ $letter_next ] = $y;
                  $letter_stack[ $letter_next ] = $letter_head[ $k ];
                  $letter_head[ $k ] = $letter_next;
                  $letter_next++;
                  $lettersused .= $z;

                }
            }
          $x+=$dx;
          $y+=$dy;
       }

   return;
  }


# ------------------------------------------------------

sub overlap
  {# this procedure will take the current word, stored in $thisword,
   # and place it into the puzzle by overlappin it with existing words
   my ($cur_x_start, $cur_y_start, $cur_dir, $cur_overlap,  $num_equals);
   my ($this_len,  $dir_freq);
   my ($letters_before, $letters_after, $FITS, $dx, $dy);
   my ($i, $j, $k, , $m, $n, $w, $x, $y, $z, $row, $col, $dir, $strt_x, $strt_y, $end_x, $end_y );
   $this_len = length $thisword;
   $best_overlap = 0;
   $num_equals = 0;
   for ($i=0; $i < $this_len; $i++ )
     { #go through each character of the word
       $z=substr($thisword, $i, 1);
       $letters_before = $i;
       $letters_after = $this_len - $i - 1;
       # we have nothing to do if this character is a space
       if ($z ne " " )
         { # we have a letter, not a space
           # we want to look at every place that this letter appears in the puzzle
          $j = index($letters,$z);
          $k= $letter_head[$j];
          while ($k > 0)
            { #$k points to the next location for this letter
              $col=$letter_x_val[$k];
              $row=$letter_y_val[$k];
              # if we try to overlap the word from this point we need to examine
              # each of the eight directions
              for ($dir=1; $dir<=8; $dir++)
                { # now looking in direction $dir
                  # knowing this point and the direction we can compute the
                  # start and end spots for the possible overlap
                  $dx = $delta_x[ $dir ];
                  $dy = $delta_y[ $dir ];
                  $strt_x = $col - $dx * $letters_before;
                  $strt_y = $row - $dy * $letters_before;
                  $end_x = $col + $dx * $letters_after;
                  $end_y = $row + $dy * $letters_after;
                  if ( ($strt_x > 0) && ($strt_y > 0) && ($strt_x <= $puzSize) && ($strt_y <= $puzSize)
                       &&  ($end_x > 0) && ($end_y > 0) && ($end_x <= $puzSize) && ($end_y <= $puzSize) )
                    { # the word would fit in this direction, now we need to see if it really does.
                      $cur_overlap = 0;
                      $FITS = $TRUE;
                      for ($m=0; $m<$this_len; $m++)
                        {  # check each letter of the word, it must be blank, or the appropriate
                           # puzzle location must be blank, or this character and the puzzle location
                           # must match, in which case we have an overlap.
                           $w=substr($thisword,$m, 1);
                           if( ($w eq " ") || ($puzzle[ mapFromTwo($strt_x+$m*$dx,$strt_y+$m*$dy)] eq " ") )
                              { # this would work
                              }
                           elsif ( $puzzle[ mapFromTwo($strt_x+$m*$dx,$strt_y+$m*$dy)] eq $w)
                              { # this works and is an overlap
                                $cur_overlap++;
                              }
                           else { # did not work, mark as failed and quit checking
                                  $FITS =$FALSE;
                                  last;
                                }
                        } # for each letter in position $m
                      # Either the word fit or it did not.  We have work to do if it did.
                      if ($FITS)
                        { # the word fit from the starting position in the given direction and
                          # we now have the number of overlaps.
                          # print "current overlap = $cur_overlap and best overlap = $best_overlap \n";
                          # print "dir=$dir, dir_this=$dir_this $directionuse[$dir]  $directionuse[$dir_this] \n";
                          # $waste=<STDIN>;
                          if ($cur_overlap > $best_overlap )
                              { # new best location
                                $best_overlap = $cur_overlap;
                                $start_x = $strt_x;
                                $start_y = $strt_y;
                                $dir_this = $dir;
                                $num_equals = 1;
                              }
                          elsif (($cur_overlap == $best_overlap) &&
                                 ( $directionuse[$dir] < $directionuse[$dir_this] ) )
                              { # replace the old with this because the direction is underrepresented
                                $start_x = $strt_x;
                                $start_y = $strt_y;
                                $dir_this = $dir;
                                $num_equals = 1;
                              }
                          elsif (($cur_overlap == $best_overlap) &&
                                 ( $directionuse[$dir] == $directionuse[$dir_this] ) )
                              { # we have a running tie
                                $num_equals++;
                                #replace by random selection
                                if (rand() <= 1.0/$num_equals)
                                   {
                                     $start_x = $strt_x;
                                     $start_y = $strt_y;
                                     $dir_this = $dir;
                                   } # end of random choice
                              }
                           else { #nothing to do
                                }
                        } # end of FITS
                    } # end of if that checks to be sure the word would fit inside the puzzle
                }  # end of for $dir
              # to move on to the next location for this letter, update $k
              $k = $letter_stack[$k];
            } # end of while ($k > 0)
         } # end of if ($x ne " " )
     } # end of the for $i

   return ($best_overlap>0);
  }


# ------------------------------------------------------

sub insertword
  { # This routine will put the word into an open slot, that is, into a set of contiguous
    # blanks.  Thus, we need only look in four directions (1-4) knowing that we can use
    # the opposite pairing if we want to.   We will search starting in the upper left corner
    # of the puzzle.  First we will determine the lowest frequency of use for any direction.
    # Later, when we find a place that fits, if its direction of use matches that low frequency
    # then we can stop the search and just call it done.  Otherwise, we will keep a location
    # with the lowest frequency of use so far and we will keep searching the puzzle.

    my ($row, $col, $x, $y, $this_len, $i, $j, $k, $m, $n, $dx, $dy);
    my ($FOUND, $dir, $alt_dir, $low_freq, $strt_x, $strt_y, $which_dir, $num_found );
    my ($best_so_far );
    # first find the lowest frequency of use for any direction

    $low_freq = $directionuse[ 1 ];

    for ($i=2; $i<=8; $i++ ) { if ($directionuse[$i] < $low_freq)
                                 { $low_freq = $directionuse[$i] }
                              }
    $FOUND= $FALSE;
    $this_len = length $thisword;
    $num_found = 0;
    $best_overlap = 0;
    $best_so_far = 123456789;
    for ($row=1; $row <= $puzSize; $row++ )
      {for ($col=1; $col <= $puzSize; $col++ )
         { # look at the character in position (col,row) of the puzzle
           if( $puzzle[ mapFromTwo( $col, $row ) ] eq " " )
              { # we have a starting point because we are at a space in the puzzle
                # now we want to look in all four directions, 1-4, for sufficient contiguous spaces
                for ($dir=1; $dir<=4; $dir++)
                   { $dx=$delta_x[$dir];
                     $dy=$delta_y[$dir];
                     $j=1;
                     while ( ($j<$this_len) &&
                             ( $puzzle[ mapFromTwo($col+$j*$dx, $row+$j*$dy) ] eq " " ) )
                        { $j++ }
                     # if $j is equal to $this_len then we found a space
                     $num_found++;
                     if( $j == $this_len )
                    { $FOUND = $TRUE;
                     # The first concern is if we should stop the search because this is a
                     # location that hits one of the least frequently used directions
                     if ( $directionuse[$dir] == $low_freq )
                       { # yes it is
                           $start_x =$col;
                           $start_y = $row;
                           $dir_this =$dir;
                           $num_found=1;
                           return $TRUE;
                       }
                     elsif ($directionuse[$dir+4] == $low_freq )
                       { # the opposite direction works
                           $start_x =$col+($this_len-1)*$dx;
                           $start_y = $row+($this_len-1)*$dy;
                           $dir_this =$dir+4;
                           $num_found=1;
                           return $TRUE;
                       }
                    else
                       { # we have found a new location.  We want to keep this new location
                         # if the associated frequency of use for this direction is less than
                         # the previous lowest frequency of use
                         if ($directionuse[ $dir ] < $best_so_far )
                           { $best_so_far = $directionuse[ $dir ];
                             $start_x =$col;
                             $start_y = $row;
                             $dir_this =$dir;
                             $num_found=1;

                           }
                         elsif ($directionuse[ $dir+4 ] < $best_so_far )
                           { $best_so_far = $directionuse[ $dir+4 ];
                             $start_x =$col+($this_len-1)*$dx;
                             $start_y = $row+($this_len-1)*$dy;
                             $dir_this =$dir+4;
                             $num_found=1;

                           }
                         else { # we do not have a certain better location, but is it equal,
                                # if so then randomly choose which to keep
                                if ( $directionuse[$dir] == $best_so_far )
                                   { if (rand() <= 1.0/$num_found )
                                      {
                                        $start_x =$col;
                                        $start_y = $row;
                                        $dir_this =$dir;

                                      }
                                   }
                                elsif ($directionuse[$dir+4] == $best_so_far )
                                   { if (rand() <= 1.0/$num_found )
                                      {
                                        $start_x =$col+($this_len-1)*$dx;
                                        $start_y = $row+($this_len-1)*$dy;
                                        $dir_this =$dir+4;

                                      }
                                   }
                                else {  # nothing to do
                                     }
                              }

                       }
                       } #end of if $j == $this_len
                   } # end of for looking in the different directions
              } # end of if starting at a blank
         } # end of for col

      } # end of for row

    return $FOUND;
  }


# ------------------------------------------------------

sub increase_puzzle_size
  { my ($x,$y,$i,$j);
    #need to change the final column and row to blanks, and add a column and row of dashes.
    $puzSize++;
    $i = $puzSize;
    for ($j=1;$j<=$i; $j++ )
      { $puzzle[ mapFromTwo($i,$j) ] = " ";
        $puzzle[ mapFromTwo($j,$i) ] = " ";
      }
    $i++;
    for ($j=0;$j<=$i; $j++ )
      { $puzzle[ mapFromTwo($i,$j) ] = "-";
        $puzzle[ mapFromTwo($j,$i) ] = "-";
      }
    if( $t_l > 7 ) {print "Just increased puzzle size to $puzSize\n";
                    dump_puzzle()
                   }

  }


# ------------------------------------------------------

sub fill_puzzle
  { # this routine will go through the puzzle and it will replace each blank with a
    # random character aken from the complete set of characters previously placed
    # in the puzzle.  This process is designed to maintain the distribution of characters
    # in the puzzle.
    my ($row, $col, $len_used, $which, $where);
    $len_used = length ( $lettersused );
    for ( $col=1; $col <= $puzSize; $col++ )
      { for ($row=1; $row <= $puzSize; $row++ )
         {  $where = mapFromTwo( $col, $row );
            if ( $puzzle[ $where] eq " " )
              {  $puzzle[ $where ] = substr( $lettersused, (int(rand()*$len_used)),1 );
              }
         }
      }
    if ($t_l > 4) { print " Fill the puzzle:\n";
                    dump_puzzle();
                  }
    return;
  }


# ------------------------------------------------------

sub write_puzzle
  { # this routine will get a file name from the user.  That name will become the name of the
    # output file to hold the puzzle.  We expect to call this routine twice, once for the 
    # non-filled puzzle and once for the filled puzzle.  The calling program needs to supply 
    # the prompt as a string.
    my $OutFileName;   # holds the name of the output file
    my $prompt;
    my ($row, $col, $i, $j, $k );
    my ($lenpart, $wordpart, $x, $oldlen );

    ($prompt)= @_;
    print "$prompt";
    $OutFileName = <STDIN>;
    chomp $OutFileName;
    if( length ($OutFileName ) >= 1 )
      {
       open(OUTFILE,">$OutFileName") || die "Could not open $OutFileName for output.";
       print OUTFILE "<HTML><TITLE>Puzzle: $OutFileName</TITLE></HEAD>\n";
       print OUTFILE "<BODY>\n<CENTER><H2>Hidden Word Puzzle</H2><br>\n";
       print OUTFILE "<table border=4><tr><td>\n \n<table border=0 cellspacing=2 cellpadding=2>\n";
       for ($row = 1; $row<= $puzSize; $row++ )
         {  print OUTFILE "<tr ALIGN=CENTER>\n";
            for ($col=1; $col<=$puzSize; $col++ )
             { $i=mapFromTwo( $col, $row ) ;
               print OUTFILE "<td>&nbsp;$puzzle[$i]&nbsp;</td> ";
             }
            print OUTFILE "\n</tr>\n";
         }
       print OUTFILE "</table> \n</td></tr></table> \n<br>\n<H3> List of Words </H3><br></CENTER>\n";
       print OUTFILE "<table border=4 width=100% cellspacing=2 cellpadding=2><tr align=left><td>\n";

       $k=0;
       foreach $x (sort keys %lenwords )
         { $k++;
           $lenpart=substr($x,0,2);
           $wordpart=substr($x,2);
           if( $k == 1 )
              {$oldlen = $lenpart;
              }
           if ( $lenpart ne $oldlen )
              { print OUTFILE "\n</td></tr>\n<tr align=left><td>\n";
                $oldlen = $lenpart;
              }
           print OUTFILE "&nbsp;$wordpart&nbsp; ";
         }


       print OUTFILE "\n</td></tr></table>\n";
       print OUTFILE "\n</BODY>\n</HTML>\n";
       close OUTFILE;
      }
    return;
  }


# ------------------------------------------------------

sub mapFromTwo
  {my ($x,$y);
   ($x,$y)=@_;
   return ($x+$y*$maxSize);

  }

