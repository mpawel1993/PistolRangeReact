package pl.pistolrange.pistolrange_server.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "question")
public class QuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String value;

    @Column(name = "good_answer")
    private String goodAnswer;

    @Column(nullable = false)
    private String a_answer;

    @Column(nullable = false)
    private String b_answer;

    @Column(nullable = false)
    private String c_answer;
}
