package helper;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TimeFormatHelper {

    private Pattern pattern;

    private Matcher matcher;

    private static final String TIME_PATTERN = "([01]?[0-9]|2[0-3]):[0-5][0-9]";

    public TimeFormatHelper() {
	pattern = Pattern.compile(TIME_PATTERN);
    }

    /**
     * Validate time in 24 hours format with regular expression
     * 
     * @param time
     *            time address for validation
     * @return true valid time format, false invalid time format
     */
    public boolean validate(final String time) {
	matcher = pattern.matcher(time);
	return matcher.matches();
    }

}
