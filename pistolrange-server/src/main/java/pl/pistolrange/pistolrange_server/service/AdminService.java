package pl.pistolrange.pistolrange_server.service;

import org.springframework.stereotype.Service;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;

@Service
public class AdminService {

    public void importQuestions(QuestionDto questionDto) {
        System.out.println(questionDto);
    }
}
