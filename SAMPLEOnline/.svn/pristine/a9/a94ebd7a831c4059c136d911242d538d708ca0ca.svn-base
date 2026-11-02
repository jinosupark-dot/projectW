package kr.co.wllife.acs.online.fwk.com.cmm;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.ibatis.executor.result.DefaultResultHandler;
import org.apache.ibatis.executor.resultset.ResultSetHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.ResultContext;
import org.apache.ibatis.session.ResultHandler;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j 
@Intercepts(
{ @Signature(type = DefaultResultHandler.class, method = "handleResult", args =
        { ResultContext.class }), @Signature(type = StatementHandler.class, method = "update", args =
        { Statement.class }), @Signature(type = StatementHandler.class, method = "query", args =
        { Statement.class, ResultHandler.class }),
        @Signature(type = ResultSetHandler.class, method = "handleResultSets", args =
        { Statement.class }) })
@Component        
public class MybatisInterceptor implements Interceptor
{
    // static final Logger log = LoggerFactory.getLogger(MybatisInterceptor.class);

    public static String columNameType;

    public String getColumNameType()
    {
        return columNameType;
    }

    public void setColumNameType(String columNameType)
    {
        MybatisInterceptor.columNameType = columNameType;
    }

    @Override
    public Object plugin(Object target)
    {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties arg0)
    {

    }

    @Override
    public Object intercept(Invocation invocation) throws Throwable
    {
        Object invocationtarget = (Object) invocation.getTarget();

        /*------------------------------------------------------------------------------------------------------------------
         * 일반적인 조회 및 저장처리에 대한 SQL 로그
        ----------------------------------------------------------------------------------------------------------------- */
        if (invocationtarget instanceof StatementHandler)
        {
            boolean logwrite = false;

            // SQL 로그를 찍어준다.
            StatementHandler handler = (StatementHandler) invocationtarget;
            if (handler.getBoundSql().getSql().indexOf("/* nolog */") == -1)
            {
                logwrite = true;

                String sql = getSqlLog(handler);
                
                // SQL의 ID 를 얻어온다.
                Field field = ReflectionUtils.findField(invocationtarget.getClass(), "delegate");
                ReflectionUtils.makeAccessible(field);
                Object delegate = ReflectionUtils.getField(field, invocationtarget);
                Field mappedStatementField = ReflectionUtils.findField(delegate.getClass(), "mappedStatement");
                ReflectionUtils.makeAccessible(mappedStatementField);
                MappedStatement mappedStatement = (MappedStatement) ReflectionUtils.getField(mappedStatementField,
                        delegate);
                
                log.debug("RUN_SQL " +  mappedStatement.getId() + "\n----------------------------------------------------------------------------------------------\n" + sql + "\n");
            }

            try
            {
                return invocation.proceed();
            } catch (InvocationTargetException e) {              
                String sql = getSqlLog((StatementHandler) invocationtarget);
                log.error("----------------------------------------------------------------------------------------------\n" + sql + "\n----------------------------------------------------------------------------------------------", e);
                throw e;
            } catch (Exception e) {              
                String sql = getSqlLog((StatementHandler) invocationtarget);
                log.error("----------------------------------------------------------------------------------------------\n" + sql + "\n----------------------------------------------------------------------------------------------", e);
                throw e;
            }
        }
        return invocation.proceed();
    }

    public String getSqlLog(StatementHandler handler)
    {
        String sql = handler.getBoundSql().getSql();
        Object param = handler.getParameterHandler().getParameterObject();
        List<ParameterMapping> paramMapping = handler.getBoundSql().getParameterMappings();
        List foreachlist = new ArrayList();

        for (ParameterMapping mapping : paramMapping)
        {
            sql = sql.replaceFirst("\\?", "#{" + mapping.getProperty() + "}");
        }

        for (ParameterMapping mapping : paramMapping)
        {
            String sqlparam = "#{" + mapping.getProperty() + "}";
            String sqlparamname = mapping.getProperty();
            Object sqlparamvalue = ((Map) param).get(sqlparamname);

            if (!sqlparamname.startsWith("__frch_"))
            {
                if (isNull(sqlparamvalue))
                {
                    sql = sql.replace(sqlparam, "NULL");
                } else
                {
                    if (sqlparamvalue instanceof String)
                    {
                        try
                        {
                            sql = sql.replace(sqlparam, "'" + getSQLString(sqlparamvalue.toString()) + "'");
                        } catch (RuntimeException e)
                        {
                            sql = sql.replace(sqlparam, "'" + getSQLString(sqlparamvalue.toString()) + "'");
                        } catch (Exception e)
                        {
                            sql = sql.replace(sqlparam, "'" + getSQLString(sqlparamvalue.toString()) + "'");
                        }
                    } else
                    {
                        sql = sql.replace(sqlparam, sqlparamvalue.toString());
                    }
                }
            } else
            {
                if (foreachlist.size() == 0)
                {
                    Map parammap = (Map) param;
                    Iterator iterator = parammap.keySet().iterator();
                    while (iterator.hasNext())
                    {
                        String key = iterator.next().toString();
                        Object value = (Object) parammap.get(key);
                        if (value instanceof List)
                        {
                            List valuelist = (List) value;
                            for (int i = 0; i < valuelist.size(); i++)
                            {
                                foreachlist.add(valuelist.get(i));
                            }
                        }
                    }
                }

                String buff = sqlparamname.split("__frch_")[1];
                int index = Integer.parseInt(buff.substring(buff.lastIndexOf("_") + 1));

                try
                {
                    sql = sql.replace(sqlparam, "'" + getSQLString((String) foreachlist.get(index)) + "'");
                } catch (RuntimeException e)
                {
        			log.info(e.getLocalizedMessage());
                } catch (Exception e)
                { 
        			log.info(e.getLocalizedMessage());
                }
            }
        }

        return sql;
    }
    
    public boolean isNull(Object value)
    {
        if(value==null)
            return true;

        String strvalue = value.toString();

        if("".equals(strvalue)||"null".equals(strvalue)||"undefined".equals(strvalue))
            return true;

        return false;
    }
    
    public String getSQLString(String str)
    {
        return str.replaceAll("'", "''");
    }
}
